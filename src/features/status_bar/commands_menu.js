const vscode = require('vscode');
const { QuickPickItemKind } = vscode;
const { EXTENSION_ID } = require('../../constants');
const { getSetting, updateGlobalSetting, isShown } = require('../../utils/config');
const { statusBarSettingFor } = require('./status_bar_items');
const { customCommandId, isGitCommand, isActiveCustomCommand } = require('./custom_commands');

const COMMANDS_MENU_ID = 'flutter-tasks.commandsMenu';
const RECENT_KEY = `${EXTENSION_ID}:recent-menu-commands`;
const RECENT_LIMIT = 5;

const PIN_BUTTON = { iconPath: new vscode.ThemeIcon('pin'), tooltip: 'Pin: show in status bar and on top of this menu' };
const UNPIN_BUTTON = { iconPath: new vscode.ThemeIcon('pinned'), tooltip: 'Unpin: hide from status bar' };

/** Groups of the "Flutter" status bar menu. `command` is an already registered command id. */
const MENU_GROUPS = [
    {
        title: 'Flutter',
        items: [
            { label: '$(trash) Flutter clean', description: 'flutter clean && flutter pub get', command: 'flutter-tasks.clean' },
            { label: '$(cloud-download) Pub get', description: 'flutter pub get', command: 'flutter-tasks.pubGet' },
            { label: '$(fold-up) Build Runner', description: 'dart run build_runner build --delete-conflicting-outputs', command: 'flutter-tasks.buildRunner' },
            { label: '$(device-mobile) Flutter install', commandSetting: 'installCommand', command: 'flutter-tasks.install' },
            { label: '$(remote) Flutter Flavor', description: 'Alt+F', command: 'flutter-tasks.flavor' },
            { label: '$(github-action) Easy Localizations', description: 'easy_localization:generate', command: 'flutter-tasks.locale' },
        ],
    },
    {
        title: 'Builds',
        items: [
            { label: '$(package) Open Build…', description: 'APK / AAB / IPA / .app, any flavor', command: 'flutter-tasks.openApkFolder' },
        ],
    },
    {
        title: 'Android',
        items: [
            { label: '$(pulse) Build APK', commandSetting: 'buildApkCommand', command: 'flutter-tasks.buildApk' },
            { label: '$(pulse) Build small APK', commandSetting: 'smallApkCommand', command: 'flutter-tasks.smallApk' },
        ],
    },
    {
        title: 'iOS',
        items: [
            { label: '$(pulse) Build iOS', commandSetting: 'iosCommand', command: 'flutter-tasks.ios' },
            { label: '$(pulse) Build IPA', commandSetting: 'ipaCommand', command: 'flutter-tasks.ipa' },
        ],
    },
    {
        title: 'Git',
        items: [
            { label: '$(repo-pull) Git pull', description: 'git pull', command: 'flutter-tasks.gitPull' },
        ],
    },
    {
        title: 'Settings',
        items: [
            { label: '$(settings-gear) Settings Panel', description: 'Toggles, status bar icons, custom commands', command: 'flutter-tasks.openSettingsPanel' },
            { label: '$(json) Open settings.json', command: 'flutter-tasks.openSettingsJson' },
        ],
    },
];

function customCommandsGroups() {
    const configs = (getSetting('customCommandsList') || []).filter(isActiveCustomCommand);
    const groups = getSetting('customCommandGroups') || [];
    const known = new Set(groups.map(group => group.id));
    const toItem = (config, icon) => ({
        label: `${icon} ${config.label}`,
        description: [config.command, ...(config.then || []).filter(Boolean)].join(' && '),
        command: customCommandId(config),
    });
    const git = configs.filter(isGitCommand).map(config => toItem(config, '$(git-branch)'));
    const ungrouped = configs.filter(config => !isGitCommand(config) && !(config.group && known.has(config.group)))
        .map(config => toItem(config, '$(tools)'));
    const sections = [
        ...(git.length > 0 ? [{ title: 'Git', items: git }] : []),
        ...(ungrouped.length > 0 ? [{ title: 'Custom Commands', items: ungrouped }] : []),
    ];
    for (const group of groups) {
        const items = configs.filter(config => !isGitCommand(config) && config.group === group.id)
            .map(config => toItem(config, '$(folder)'));
        if (items.length > 0) {
            sections.push({ title: group.label || 'Menu', items });
        }
    }
    return sections;
}

/** A command is "pinned" when its status bar button is shown. */
function isPinned(item) {
    const setting = statusBarSettingFor(item.command);
    return Boolean(setting) && isShown(getSetting(setting));
}

function withPinButton(item) {
    if (!statusBarSettingFor(item.command)) {
        return item;
    }
    const description = item.commandSetting ? getSetting(item.commandSetting) : item.description;
    return { ...item, description, buttons: [isPinned(item) ? UNPIN_BUTTON : PIN_BUTTON] };
}

/**
 * Menu order: pinned (shown in status bar) → recently used → custom commands → all other groups.
 * Every command appears only once.
 */
function buildMenuItems(context) {
    const groups = [...customCommandsGroups(), ...MENU_GROUPS];
    const allItems = groups.flatMap(group => group.items);
    const byCommand = new Map(allItems.map(item => [item.command, item]));
    const used = new Set();
    const take = item => {
        used.add(item.command);
        return withPinButton(item);
    };

    const pinned = allItems.filter(isPinned).map(take);
    const recent = context.globalState.get(RECENT_KEY, [])
        .map(command => byCommand.get(command))
        .filter(item => item && !used.has(item.command))
        .map(take);

    const sections = [
        { title: '📌 Pinned', items: pinned },
        { title: '🕘 Recent', items: recent },
        ...groups.map(group => ({
            title: group.title,
            items: group.items.filter(item => !used.has(item.command)).map(withPinButton),
        })),
    ];

    return sections
        .filter(section => section.items.length > 0)
        .flatMap(section => [{ label: section.title, kind: QuickPickItemKind.Separator }, ...section.items]);
}

async function rememberRecent(context, command) {
    const recent = context.globalState.get(RECENT_KEY, []).filter(id => id !== command);
    await context.globalState.update(RECENT_KEY, [command, ...recent].slice(0, RECENT_LIMIT));
}

function showCommandsMenu(context) {
    const quickPick = vscode.window.createQuickPick();
    quickPick.placeholder = 'Simpler Flutter Tasks — choose a command (📌 pins it to the status bar)';
    quickPick.matchOnDescription = true;
    quickPick.items = buildMenuItems(context);

    quickPick.onDidTriggerItemButton(async ({ item }) => {
        const setting = statusBarSettingFor(item.command);
        await updateGlobalSetting(setting, isPinned(item) ? 'hide' : 'show');
        quickPick.items = buildMenuItems(context);
    });

    quickPick.onDidAccept(() => {
        const [selected] = quickPick.selectedItems;
        quickPick.hide();
        if (selected && selected.command) {
            rememberRecent(context, selected.command);
            vscode.commands.executeCommand(selected.command);
        }
    });

    quickPick.onDidHide(() => quickPick.dispose());
    quickPick.show();
}

function registerCommandsMenu(context) {
    context.subscriptions.push(vscode.commands.registerCommand(COMMANDS_MENU_ID, () => showCommandsMenu(context)));
}

module.exports = {
    COMMANDS_MENU_ID,
    registerCommandsMenu,
};
