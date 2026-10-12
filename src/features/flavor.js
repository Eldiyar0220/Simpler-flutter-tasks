const vscode = require('vscode');
const { QuickPickItemKind } = vscode;
const { getSetting, updateGlobalSetting } = require('../utils/config');
const { showTimedNotification } = require('../utils/notifications');
const { runInTerminal } = require('../utils/terminal');
const { openBuild } = require('./build_outputs');

const PRODUCTION_FLAVORS = ['prod', 'Prod', 'production', 'Production'];
const FLAVOR_ACTIONS = new Set(['run', 'openApk', 'openBundle', 'deleteApk', 'separator']);

const DEFAULT_FLAVORS = {
    path: 'lib/main',
    flavors: [
        { title: 'prod', package: 'com_packages_of_your_app' },
        { title: 'staging', package: 'com_packages_of_your_app' },
        { title: 'dev', package: 'com_packages_of_your_app' },
    ],
};

const DEFAULT_FLAVOR_COMMANDS = [
    { label: 'Android', action: 'separator', afterDelete: true },
    { label: 'Build APK ->', command: 'flutter build apk --flavor ${flavor} -t ${path}.dart', afterDelete: true },
    { label: 'iOS', action: 'separator' },
    { label: 'Build IOS ->', command: 'flutter build ios --flavor ${flavor}' },
    { label: 'Build IPA ->', command: 'flutter build ipa --flavor ${flavor}' },
    { label: 'Android', action: 'separator', afterDelete: true },
    { label: 'Build bundle ->', command: 'flutter build appbundle --flavor ${flavor} -t ${path}.dart', prodOnly: true, afterDelete: true },
    { label: 'Open bundle ->', action: 'openBundle', prodOnly: true },
    { label: 'Open APK ->', action: 'openApk', afterDelete: true },
    { label: 'Flutter Run ->', command: 'flutter run --release --flavor ${flavor} -t ${path}.dart' },
    { label: 'Flutter Install $(star-full) ->', command: 'adb install build/app/outputs/flutter-apk/app-${flavor}-release.apk', afterDelete: true },
    { label: 'Delete Apk', command: 'adb uninstall ${package}', action: 'deleteApk' },
];

function sanitizeFlavorCommand(item) {
    if (!item || typeof item !== 'object') {
        return undefined;
    }
    const label = String(item.label || '').trim();
    if (!label) {
        return undefined;
    }
    const action = FLAVOR_ACTIONS.has(item.action) ? item.action : inferAction(item);
    const clean = { label, command: String(item.command || ''), action };
    if (item.prodOnly === true || item.prodOnly === 'true') {
        clean.prodOnly = true;
    }
    if (item.afterDelete === true || item.afterDelete === 'true') {
        clean.afterDelete = true;
    }
    return clean;
}

function inferAction(item) {
    if (item.kind === 'separator') {
        return 'separator';
    }
    const label = String(item.label || '');
    if (label === 'Open APK ->' || label === 'Open APK') {
        return 'openApk';
    }
    if (label === 'Open bundle ->' || label === 'Open bundle') {
        return 'openBundle';
    }
    if (label === 'Delete Apk') {
        return 'deleteApk';
    }
    return 'run';
}

function sanitizeFlavorConfig(value) {
    const stored = value && typeof value === 'object' ? value : {};
    const path = String(stored.path || DEFAULT_FLAVORS.path).trim() || DEFAULT_FLAVORS.path;
    const flavors = Array.isArray(stored.flavors)
        ? stored.flavors
            .map(item => item && typeof item === 'object'
                ? { title: String(item.title || '').trim(), package: String(item.package || '').trim() }
                : undefined)
            .filter(item => item && item.title)
        : DEFAULT_FLAVORS.flavors.map(item => ({ ...item }));
    const commands = Array.isArray(stored.commands) && stored.commands.length > 0
        ? stored.commands.map(sanitizeFlavorCommand).filter(Boolean)
        : DEFAULT_FLAVOR_COMMANDS.map(item => ({ ...item }));
    return { path, flavors, commands };
}

function getFlavorConfig() {
    return sanitizeFlavorConfig(getSetting('Flavors'));
}

/** Flavor names from the "Flavors" setting, or the default ones when it is empty. */
function flavorTitles() {
    const titles = getFlavorConfig().flavors.map(flavor => flavor.title).filter(Boolean);
    return titles.length > 0 ? titles : DEFAULT_FLAVORS.flavors.map(flavor => flavor.title);
}

function interpolate(template, flavor, packageName, mainPath) {
    return String(template || '')
        .replace(/\$\{flavor\}/g, flavor)
        .replace(/\$\{package\}/g, packageName)
        .replace(/\$\{path\}/g, mainPath);
}

function registerFlavorCommands(context) {
    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand('flutter-tasks.activateFlavor', () => {
            vscode.commands.executeCommand('flutter-tasks.flavor');
        }),
        vscode.commands.registerCommand('flutter-tasks.flavor', pickFlavor),
    );
}

async function pickFlavor() {
    let { path: mainPath, flavors } = getFlavorConfig();
    if (flavors.length === 0) {
        await updateGlobalSetting('Flavors', {
            ...getFlavorConfig(),
            flavors: DEFAULT_FLAVORS.flavors,
            path: mainPath || DEFAULT_FLAVORS.path,
        });
        flavors = DEFAULT_FLAVORS.flavors;
        mainPath = mainPath || DEFAULT_FLAVORS.path;
    }

    const titles = flavors.map(flavor => flavor.title);
    const selectedTitle = await vscode.window.showQuickPick(titles, { detail: 'Выберите команду', modal: true });
    if (selectedTitle) {
        const selected = flavors[titles.indexOf(selectedTitle)];
        pickFlavorCommand(selected.title, selected.package, mainPath, false);
    }
}

async function pickFlavorCommand(flavor, packageName, mainPath, installOnly) {
    const commands = visibleFlavorCommands(flavor, installOnly).map(item => toQuickPickItem(item, flavor, packageName, mainPath));
    const selected = await vscode.window.showQuickPick(commands, {
        detail: 'Выберите команду',
        modal: true,
        placeHolder: flavor.toUpperCase(),
    });
    if (!selected) {
        return;
    }

    if (selected.action === 'openApk') {
        openBuild({ kinds: ['apk', 'aab'], flavor });
    } else if (selected.action === 'openBundle') {
        openBuild({ kinds: ['aab'], flavor });
    } else if (selected.action === 'deleteApk') {
        runInTerminal(selected.command);
        setTimeout(() => pickFlavorCommand(flavor, packageName, mainPath, true), 100);
    } else if (selected.command) {
        runInTerminal(selected.command);
    }
    showTimedNotification(`Starting ${selected.label} ✅`, 15);
}

function visibleFlavorCommands(flavor, installOnly) {
    return getFlavorConfig().commands.filter(item => {
        if (item.prodOnly && !PRODUCTION_FLAVORS.includes(flavor)) {
            return false;
        }
        if (installOnly && !item.afterDelete) {
            return false;
        }
        return true;
    });
}

function toQuickPickItem(item, flavor, packageName, mainPath) {
    if (item.action === 'separator') {
        return { label: interpolate(item.label, flavor, packageName, mainPath), kind: QuickPickItemKind.Separator };
    }
    const command = interpolate(item.command, flavor, packageName, mainPath);
    return {
        label: interpolate(item.label, flavor, packageName, mainPath),
        description: command,
        command,
        action: item.action || 'run',
    };
}

module.exports = {
    registerFlavorCommands,
    flavorTitles,
    getFlavorConfig,
    sanitizeFlavorConfig,
    DEFAULT_FLAVORS,
    DEFAULT_FLAVOR_COMMANDS,
};
