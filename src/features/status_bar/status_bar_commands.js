const vscode = require('vscode');
const { getSetting } = require('../../utils/config');
const { showTimedNotification } = require('../../utils/notifications');
const { runInTerminal } = require('../../utils/terminal');
const { openBuild, openBuildForItem } = require('../build_outputs');
const { flavorTitles } = require('../flavor');

const CLEAN_COMMAND = process.platform === 'win32'
    ? 'flutter clean | flutter pub get'
    : 'flutter clean && flutter pub get';

/** Commands that just run a shell command and show a notification. `setting` makes the command editable. */
const TERMINAL_COMMANDS = [
    { id: 'flutter-tasks.clean', command: CLEAN_COMMAND, message: 'Project is cleaning', duration: 20 },
    { id: 'flutter-tasks.pubGet', command: 'flutter pub get', message: 'Pub getting', duration: 30 },
    { id: 'flutter-tasks.buildApk', command: 'flutter build apk', setting: 'buildApkCommand', message: 'Building APK', duration: 30 },
    { id: 'flutter-tasks.ios', command: 'flutter build ios', setting: 'iosCommand', message: 'Building IOS', duration: 30 },
    { id: 'flutter-tasks.ipa', command: 'flutter build ipa', setting: 'ipaCommand', message: 'Building IPA', duration: 30 },
    { id: 'flutter-tasks.buildRunner', command: 'dart run build_runner build --delete-conflicting-outputs', message: 'Build Running', duration: 30 },
    { id: 'flutter-tasks.install', command: 'flutter install', setting: 'installCommand', message: 'Installing', duration: 70 },
    { id: 'flutter-tasks.gitPull', command: 'git pull', message: 'Pulling', duration: 70 },
    { id: 'flutter-tasks.smallApk', command: 'flutter build apk --split-per-abi', setting: 'smallApkCommand', message: 'Building Small Apk', duration: 70 },
];

/** A command ending with "--flavor" (no value) asks which flavor to use. */
const ASK_FLAVOR = /--flavor\s*$/;

async function withFlavor(command) {
    if (!ASK_FLAVOR.test(command)) {
        return command;
    }
    const withFlag = command.trimEnd();
    const withoutFlag = withFlag.replace(ASK_FLAVOR, '').trimEnd();
    const items = [
        ...flavorTitles().map(flavor => ({ label: `${withFlag} ${flavor}`, description: flavor, command: `${withFlag} ${flavor}` })),
        { label: withoutFlag, description: 'Default', command: withoutFlag },
    ];
    const selected = await vscode.window.showQuickPick(items, { placeHolder: `${withFlag} …` });
    return selected && selected.command;
}

function registerStatusBarCommands(context) {
    for (const { id, command, setting, message, duration } of TERMINAL_COMMANDS) {
        context.subscriptions.push(vscode.commands.registerCommand(id, async () => {
            const finalCommand = await withFlavor((setting && getSetting(setting)) || command);
            if (finalCommand) {
                runInTerminal(finalCommand);
                showTimedNotification(message, duration);
            }
        }));
    }

    context.subscriptions.push(
        vscode.commands.registerCommand('flutter-tasks.openBuild', openBuildForItem),
        vscode.commands.registerCommand('flutter-tasks.openApkFolder', () => openBuild()),
        vscode.commands.registerCommand('flutter-tasks.openbundleFolder', () => openBuild()),
        vscode.commands.registerCommand('flutter-tasks.locale', runEasyLocalization),
    );
}

function runEasyLocalization() {
    runInTerminal(getSetting('easyLocalizationFirst'));
    setTimeout(() => runInTerminal(getSetting('easyLocalizationSecond')), 3000);

    showTimedNotification('Locale 1 -> Successfully ✅', 30);
    setTimeout(() => showTimedNotification('Locale 2 -> Successfully ✅ ✅', 30), 2300);
}

module.exports = {
    registerStatusBarCommands,
};
