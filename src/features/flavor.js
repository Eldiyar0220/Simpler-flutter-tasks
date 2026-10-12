const vscode = require('vscode');
const { QuickPickItemKind } = vscode;
const { getSetting, updateGlobalSetting } = require('../utils/config');
const { showTimedNotification } = require('../utils/notifications');
const { runInTerminal } = require('../utils/terminal');
const { openBuild } = require('./build_outputs');

const LABELS = {
    openApk: 'Open APK ->',
    openBundle: 'Open bundle ->',
    deleteApk: 'Delete Apk',
};

const DEFAULT_FLAVORS = {
    path: 'lib/main',
    flavors: [
        { title: 'prod', package: 'com_packages_of_your_app' },
        { title: 'staging', package: 'com_packages_of_your_app' },
        { title: 'dev', package: 'com_packages_of_your_app' },
    ],
};

const PRODUCTION_FLAVORS = ['prod', 'Prod', 'production', 'Production'];

/** Flavor names from the "Flavors" setting, or the default ones when it is empty. */
function flavorTitles() {
    const flavors = (getSetting('Flavors') || {}).flavors || [];
    const titles = flavors.map(flavor => flavor.title).filter(Boolean);
    return titles.length > 0 ? titles : DEFAULT_FLAVORS.flavors.map(flavor => flavor.title);
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
    const flavorsConfig = getSetting('Flavors') || {};
    const flavors = flavorsConfig.flavors || [];
    const mainPath = flavorsConfig.path || 'lib/main';

    if (flavors.length === 0) {
        await vscode.commands.executeCommand('workbench.action.openSettingsJson');
        await updateGlobalSetting('Flavors', DEFAULT_FLAVORS);
        return;
    }

    const titles = flavors.map(flavor => flavor.title);
    const selectedTitle = await vscode.window.showQuickPick(titles, { detail: 'Выберите команду', modal: true });
    if (selectedTitle) {
        const selected = flavors[titles.indexOf(selectedTitle)];
        pickFlavorCommand(selected.title, selected.package, mainPath, false);
    }
}

async function pickFlavorCommand(flavor, packageName, mainPath, installOnly) {
    const commands = installOnly
        ? installOnlyCommands(flavor, mainPath)
        : allCommands(flavor, packageName, mainPath);
    const items = commands.map(item => item.kind ? item : { ...item, description: item.command });

    const selected = await vscode.window.showQuickPick(items, {
        detail: 'Выберите команду',
        modal: true,
        placeHolder: flavor.toUpperCase(),
    });
    if (!selected) {
        return;
    }

    if (selected.label === LABELS.openApk) {
        openBuild({ kinds: ['apk', 'aab'], flavor });
    } else if (selected.label === LABELS.openBundle) {
        openBuild({ kinds: ['aab'], flavor });
    } else if (selected.label === LABELS.deleteApk) {
        runInTerminal(selected.command);
        setTimeout(() => pickFlavorCommand(flavor, packageName, mainPath, true), 100);
    } else {
        runInTerminal(selected.command);
    }
    showTimedNotification(`Starting ${selected.label} ✅`, 15);
}

function separator(label) {
    return { label, kind: QuickPickItemKind.Separator };
}

function buildApkCommand(flavor, mainPath) {
    return { label: 'Build APK ->', command: `flutter build apk --flavor ${flavor} -t ${mainPath}.dart` };
}

function installApkCommand(flavor) {
    return { label: 'Flutter Install $(star-full) ->', command: `adb install build/app/outputs/flutter-apk/app-${flavor}-release.apk` };
}

function bundleCommands(flavor, mainPath) {
    if (!PRODUCTION_FLAVORS.includes(flavor)) {
        return [];
    }
    return [
        { label: 'Build bundle ->', command: `flutter build appbundle --flavor ${flavor} -t ${mainPath}.dart` },
        { label: LABELS.openBundle, command: flavor.toUpperCase() },
    ];
}

function allCommands(flavor, packageName, mainPath) {
    return [
        separator('Android'),
        buildApkCommand(flavor, mainPath),
        separator('iOS'),
        { label: 'Build IOS ->', command: `flutter build ios --flavor ${flavor}` },
        { label: 'Build IPA ->', command: `flutter build ipa --flavor ${flavor}` },
        separator('Android'),
        ...bundleCommands(flavor, mainPath),
        { label: LABELS.openApk, command: flavor.toUpperCase() },
        { label: 'Flutter Run ->', command: `flutter run --release --flavor ${flavor} -t ${mainPath}.dart` },
        installApkCommand(flavor),
        { label: LABELS.deleteApk, command: `adb uninstall ${packageName}` },
    ];
}

function installOnlyCommands(flavor, mainPath) {
    return [
        separator('Android'),
        installApkCommand(flavor),
        buildApkCommand(flavor, mainPath),
        ...bundleCommands(flavor, mainPath),
        { label: LABELS.openApk, command: flavor.toUpperCase() },
    ];
}

module.exports = {
    registerFlavorCommands,
    flavorTitles,
};
