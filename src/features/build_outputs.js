const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { revealInFileManager } = require('../utils/file_manager');
const { showTimedNotification } = require('../utils/notifications');
const { runInTerminal } = require('../utils/terminal');
const { getWorkspaceRoot } = require('../utils/workspace');

const ANDROID_OUTPUTS = ['build', 'app', 'outputs'];
const IOS_OUTPUTS = ['build', 'ios'];

/**
 * Build artifacts Flutter produces. `dir` is scanned (with sub folders, e.g. `bundle/prodRelease`)
 * for entries with `extension`. When nothing matches there, the wider `fallbackDir` is scanned
 * deeper, e.g. Gradle's `outputs/apk/prod/release/`.
 */
const ARTIFACT_KINDS = {
    apk: { label: 'APK', platform: 'android', dir: [...ANDROID_OUTPUTS, 'flutter-apk'], fallbackDir: ANDROID_OUTPUTS, extension: '.apk', icon: '$(package)', buildLabel: 'Build APK', buildCommandId: 'flutter-tasks.buildApk' },
    aab: { label: 'App Bundle', platform: 'android', dir: [...ANDROID_OUTPUTS, 'bundle'], fallbackDir: ANDROID_OUTPUTS, extension: '.aab', icon: '$(archive)', buildLabel: 'Build App Bundle', buildCommand: 'flutter build appbundle' },
    ipa: { label: 'IPA', platform: 'ios', dir: [...IOS_OUTPUTS, 'ipa'], fallbackDir: IOS_OUTPUTS, extension: '.ipa', icon: '$(device-mobile)', buildLabel: 'Build IPA', buildCommandId: 'flutter-tasks.ipa' },
    app: { label: 'iOS App', platform: 'ios', dir: [...IOS_OUTPUTS, 'iphoneos'], fallbackDir: IOS_OUTPUTS, extension: '.app', icon: '$(device-mobile)', buildLabel: 'Build iOS', buildCommandId: 'flutter-tasks.ios' },
};

/** Bundle-like folders: their content is never scanned (e.g. the Runner.app copy inside .xcarchive). */
const OPAQUE_FOLDER_EXTENSIONS = ['.app', '.xcarchive', '.framework', '.dSYM', '.appex', '.bundle'];

const PLATFORM_KINDS = {
    android: ['apk', 'aab'],
    ios: ['ipa', 'app'],
};
const PLATFORM_TITLES = { android: 'Android', ios: 'iOS' };
const ALL_KINDS = Object.keys(ARTIFACT_KINDS);
const SCAN_DEPTH = 2;
const FALLBACK_SCAN_DEPTH = 4;

function findInDir(dir, extension, depth) {
    let entries;
    try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
        return [];
    }
    return entries.flatMap(entry => {
        const fullPath = path.join(dir, entry.name);
        if (entry.name.endsWith(extension)) {
            return [fullPath];
        }
        const isOpaque = OPAQUE_FOLDER_EXTENSIONS.some(ext => entry.name.endsWith(ext));
        return entry.isDirectory() && !isOpaque && depth > 0 ? findInDir(fullPath, extension, depth - 1) : [];
    });
}

function findKind(root, kind, flavorFilter) {
    const { dir, fallbackDir, extension } = ARTIFACT_KINDS[kind];
    const matchesFlavor = filePath => !flavorFilter || path.basename(filePath).toLowerCase().includes(flavorFilter);

    let found = findInDir(path.join(root, ...dir), extension, SCAN_DEPTH).filter(matchesFlavor);
    if (found.length === 0 && fallbackDir) {
        found = findInDir(path.join(root, ...fallbackDir), extension, FALLBACK_SCAN_DEPTH).filter(matchesFlavor);
    }
    return found.map(filePath => ({ kind, filePath, stat: fs.statSync(filePath) }));
}

/**
 * All artifacts of the given kinds, newest first. `flavor` keeps only files whose name contains it.
 * Kinds sharing a fallback folder could find the same file twice, hence the dedupe.
 */
function findArtifacts(root, kinds, flavor) {
    const flavorFilter = flavor && flavor.toLowerCase();
    const unique = new Map();
    for (const artifact of kinds.flatMap(kind => findKind(root, kind, flavorFilter))) {
        unique.set(artifact.filePath, artifact);
    }
    return [...unique.values()].sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs);
}

function formatSize(stat) {
    if (stat.isDirectory()) {
        return '';
    }
    const mb = stat.size / (1024 * 1024);
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(stat.size / 1024))} KB`;
}

function formatAge(stat) {
    const minutes = Math.round((Date.now() - stat.mtimeMs) / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours} h ago`;
    return `${Math.round(hours / 24)} d ago`;
}

async function reveal(artifact) {
    const name = path.basename(artifact.filePath);
    if (await revealInFileManager(artifact.filePath)) {
        showTimedNotification(`Opening ${name} ✅`, 10);
    } else {
        showTimedNotification(`Can not open ${name} ❌`, 40);
    }
}

async function offerBuild(kinds, flavor) {
    const labels = kinds.map(kind => ARTIFACT_KINDS[kind].label).join(' / ');
    const message = flavor
        ? `${labels} for flavor "${flavor}" not found ❌`
        : `${labels} not found in build/ ❌`;
    // With a flavor the build command needs --flavor and -t, so the flavor menu is the place to build it.
    const buildKinds = flavor ? [] : kinds.filter(kind => ARTIFACT_KINDS[kind].buildLabel);
    const selected = await vscode.window.showInformationMessage(message, ...buildKinds.map(kind => ARTIFACT_KINDS[kind].buildLabel));
    const kind = buildKinds.find(k => ARTIFACT_KINDS[k].buildLabel === selected);
    if (kind) {
        const { buildCommandId, buildCommand } = ARTIFACT_KINDS[kind];
        if (buildCommandId) {
            vscode.commands.executeCommand(buildCommandId);
        } else {
            runInTerminal(buildCommand);
        }
    }
}

/**
 * Finds built artifacts and reveals one in the file manager:
 * none → offers to build, one → reveals it, several → lets the user pick.
 */
async function openBuild({ kinds = ALL_KINDS, flavor } = {}) {
    const root = getWorkspaceRoot();
    if (!root) {
        vscode.window.showInformationMessage('Open a Flutter project first ❌');
        return;
    }

    const artifacts = findArtifacts(root, kinds, flavor);
    if (artifacts.length === 0) {
        return offerBuild(kinds, flavor);
    }
    if (artifacts.length === 1) {
        return reveal(artifacts[0]);
    }

    const toItem = artifact => {
        const kind = ARTIFACT_KINDS[artifact.kind];
        return {
            label: `${kind.icon} ${path.basename(artifact.filePath)}`,
            description: path.relative(root, path.dirname(artifact.filePath)),
            detail: [kind.label, formatSize(artifact.stat), formatAge(artifact.stat)].filter(Boolean).join(' · '),
            artifact,
        };
    };
    const items = Object.entries(PLATFORM_TITLES).flatMap(([platform, title]) => {
        const group = artifacts.filter(artifact => ARTIFACT_KINDS[artifact.kind].platform === platform);
        return group.length > 0
            ? [{ label: title, kind: vscode.QuickPickItemKind.Separator }, ...group.map(toItem)]
            : [];
    });
    const selected = await vscode.window.showQuickPick(items, {
        placeHolder: flavor ? `Builds of "${flavor}" — newest first` : 'Builds — newest first',
        matchOnDescription: true,
        matchOnDetail: true,
    });
    if (selected) {
        reveal(selected.artifact);
    }
}

/** Command argument can be a tree item with `platform: 'android' | 'ios'`. */
function openBuildForItem(item) {
    const platform = item && item.platform;
    return openBuild({ kinds: PLATFORM_KINDS[platform] || ALL_KINDS });
}

module.exports = {
    openBuild,
    openBuildForItem,
};
