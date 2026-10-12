const vscode = require('vscode');
const { CONFIG_SECTION } = require('../../constants');
const { getSetting, isShown } = require('../../utils/config');
const { showTimedNotification } = require('../../utils/notifications');

/**
 * Built-in status bar buttons, in display order.
 * `setting` is the "show" / "hide" option, `color` is used when "colorized" is on.
 */
const STATUS_BAR_ITEMS = [
    { setting: 'commandsMenuIcon', name: 'Commands Menu', text: '$(rocket) Flutter', command: 'flutter-tasks.commandsMenu', tooltip: 'Simpler Flutter Tasks: all commands', color: '#02b5ff' },
    { setting: 'flutterCleanIcon', name: 'Clean Icon', text: 'Flutter clean $(notebook-delete-cell)', command: 'flutter-tasks.clean', tooltip: 'Flutter clean', color: '#ff0000' },
    { setting: 'flutterPubGetIcon', name: 'Pub Get Icon', text: 'Pub get', command: 'flutter-tasks.pubGet', tooltip: 'Flutter pub get', color: '#02ff0f' },
    { setting: 'buildApkIcon', name: 'Apk Icon', text: 'Build apk $(pulse)', command: 'flutter-tasks.buildApk', tooltip: 'Flutter build apk', color: '#c8ff02' },
    { setting: 'iosIcon', name: 'Ios Icon', text: 'Build ios $(pulse)', command: 'flutter-tasks.ios', tooltip: 'Flutter build ios', color: '#ff02ee' },
    { setting: 'ipaIcon', name: 'Ipa Icon', text: 'Build ipa $(pulse)', command: 'flutter-tasks.ipa', tooltip: 'Flutter build ipa', color: '#ff9900' },
    { setting: 'buildRunnerIcon', name: 'Build Runner Icon', text: '$(fold-up) Build Runner $(fold-up)', command: 'flutter-tasks.buildRunner', tooltip: 'dart run build_runner build --delete-conflicting-outputs', color: '#04ffff' },
    { setting: 'openApkIcon', name: 'Open Build Folder', text: 'Open Build Folder $(link-external)', command: 'flutter-tasks.openApkFolder', tooltip: 'Open build: APK / AAB / IPA / .app', color: '#06f002' },
    { setting: 'installIcon', name: 'Install Icon', text: 'Install $(smiley)', command: 'flutter-tasks.install', tooltip: 'Flutter install ✅', color: '#d9ff04' },
    { setting: 'gitPullIcon', name: 'Git Pull Icon', text: 'Git Pull $(smiley)', command: 'flutter-tasks.gitPull', tooltip: 'Git Pull', color: '#d9ff04' },
    { setting: 'smallApkIcon', name: 'Small Icon', text: 'Small Apk', command: 'flutter-tasks.smallApk', tooltip: 'Small Apk', color: '#d9ff04' },
    { setting: 'easyLocalizationsIcon', name: 'Easy Localizations', text: 'LocalizationS $(github-action)', command: 'flutter-tasks.locale', tooltip: 'Easy Localizations', color: '#f6ff00' },
    { setting: 'flutterFlavor', name: 'Flavor Icon', text: 'Flutter Flavor Builder $(remote)', command: 'flutter-tasks.flavor', tooltip: 'Flavor', color: '#45fc03' },
];

/** Color of a built-in button: user pick, or the default from `STATUS_BAR_ITEMS`. */
function itemColor(definition) {
    const custom = (getSetting('statusBarColors') || {})[definition.setting];
    return custom || definition.color;
}

function registerStatusBarItems(context) {
    const items = STATUS_BAR_ITEMS.map(definition => {
        const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        item.text = definition.text;
        item.command = definition.command;
        item.tooltip = definition.tooltip;
        context.subscriptions.push(item);
        return { definition, item };
    });

    const applyColors = () => {
        const colorized = getSetting('colorized');
        for (const { definition, item } of items) {
            item.color = colorized ? itemColor(definition) : undefined;
        }
    };
    const applyVisibility = ({ definition, item }) => {
        if (isShown(getSetting(definition.setting))) {
            item.show();
        } else {
            item.hide();
        }
    };

    applyColors();
    items.forEach(applyVisibility);

    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(event => {
        for (const entry of items) {
            if (event.affectsConfiguration(`${CONFIG_SECTION}.${entry.definition.setting}`)) {
                applyVisibility(entry);
                const value = getSetting(entry.definition.setting);
                showTimedNotification(`${entry.definition.name} is ${value} ${isShown(value) ? '✅' : '❌'}`, 15);
            }
        }
        if (event.affectsConfiguration(`${CONFIG_SECTION}.colorized`) || event.affectsConfiguration(`${CONFIG_SECTION}.statusBarColors`)) {
            applyColors();
            if (event.affectsConfiguration(`${CONFIG_SECTION}.colorized`)) {
                showTimedNotification('Colorized Updated ✅', 16);
            }
        }
    }));
}

/** Returns the "show" / "hide" setting key of the status bar button that runs `commandId`. */
function statusBarSettingFor(commandId) {
    const definition = STATUS_BAR_ITEMS.find(item => item.command === commandId);
    return definition && definition.setting;
}

module.exports = {
    registerStatusBarItems,
    statusBarSettingFor,
    itemColor,
    STATUS_BAR_ITEMS,
};
