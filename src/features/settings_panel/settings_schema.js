const { getSetting, isShown } = require('../../utils/config');
const { STATUS_BAR_ITEMS, itemColor } = require('../status_bar/status_bar_items');
const { flavorTitles, getFlavorConfig } = require('../flavor');
const { builtinShellCommand } = require('../status_bar/status_bar_commands');
const { GENERATOR_SECTION } = require('./generator/section');
const { isGeneratorInstalled } = require('./generator/actions');

/**
 * Controls of the settings panel. `kind` defines how a value is stored:
 *  - boolean:    true / false
 *  - visibility: "show" / "hide"
 *  - text:       free string (`flavorAware`: can end with "--flavor" to ask for a flavor on click)
 * `children` are shown only while the parent toggle is on; such controls go last in a grid.
 */
const toggle = (label, key, hint, extra = {}) => ({ kind: 'boolean', label, key, hint, ...extra });
const icon = (label, key, hint, extra = {}) => ({ kind: 'visibility', label, key, hint, ...extra });
const text = (label, key) => ({ kind: 'text', label, key });
/** A status bar button whose shell command can be changed, e.g. to add --flavor. */
const editable = (label, key, commandKey, hint) => icon(label, key, hint, {
    children: [{ ...text('Command', commandKey), flavorAware: true }],
});

const SECTIONS = [
    {
        id: 'general',
        title: 'General',
        icon: '⚙️',
        description: 'How commands from the sidebar behave.',
        controls: [
            toggle('Copy the command', 'treeViewCopyText', 'Clicking a command in the tree copies it to the clipboard'),
            toggle('Always start in a new terminal', 'createNewTerminal', 'Do not reuse the previous terminal'),
            toggle('Colorized commands', 'colorized', 'Colored built-in status bar buttons'),
            toggle('Colorized custom commands', 'colorizedCustomCommands', 'Colored buttons you added yourself'),
        ],
    },
    {
        id: 'statusBar',
        title: 'Status Bar Icons',
        icon: '📌',
        description: 'Buttons at the bottom of the window. Pinned ones are also shown first in the 🚀 menu.',
        grid: true,
        controls: [
            icon('Commands Menu 🚀', 'commandsMenuIcon', 'One button with all commands'),
            icon('Flutter Clean', 'flutterCleanIcon', 'flutter clean && flutter pub get'),
            icon('Flutter Pub get', 'flutterPubGetIcon', 'flutter pub get'),
            icon('Build Runner', 'buildRunnerIcon', 'dart run build_runner build'),
            icon('Open Build Folder', 'openApkIcon', 'Open build: APK / AAB / IPA / .app'),
            icon('Git Pull', 'gitPullIcon', 'git pull'),
            icon('GIT Helps', 'customGitMenuIcon', 'New Branch, Commit, Rebase, Push — one Git menu'),
            icon('Flutter Flavor', 'flutterFlavor', 'Run with flavor, Alt+F', { flavorEditor: true }),
            editable('Build APK', 'buildApkIcon', 'buildApkCommand', 'Editable, e.g. add --flavor'),
            editable('Build iOS', 'iosIcon', 'iosCommand', 'Editable, e.g. add --flavor'),
            editable('Build IPA', 'ipaIcon', 'ipaCommand', 'Editable, e.g. add --flavor'),
            editable('Flutter Install', 'installIcon', 'installCommand', 'Editable, e.g. add --flavor'),
            editable('Small APK', 'smallApkIcon', 'smallApkCommand', 'Split per ABI, editable, e.g. add --flavor'),
            icon('Easy Localizations', 'easyLocalizationsIcon', 'easy_localization:generate', {
                children: [
                    text('First command', 'easyLocalizationFirst'),
                    text('Second command', 'easyLocalizationSecond'),
                ],
            }),
        ],
    },
    {
        id: 'customCommands',
        title: 'Custom Commands',
        icon: '🛠️',
        description: 'Your own status bar buttons. GIT Helps keeps its own git menu. Extra commands can be dragged into a category so they share one button.',
        customCommands: true,
        controls: [],
    },
    {
        id: 'other',
        title: 'Expanded on start',
        icon: '📂',
        description: 'Sidebar categories that are always expanded when VS Code starts.',
        lesson: 'expand',
        grid: true,
        controls: [
            toggle('Build Runner', 'buildRunnerCategoryExpandable'),
            toggle('Flutter', 'flutterCategoryExpandable'),
            toggle('Android', 'androidCategoryExpandable'),
            toggle('iOS', 'iosCategoryExpandable'),
            toggle('GitHub', 'gitCategoryExpandable'),
        ],
    },
    GENERATOR_SECTION,
];

/** Text and color of the real status bar button, for the preview strip. */
function statusBarPreview(control) {
    const item = STATUS_BAR_ITEMS.find(definition => definition.setting === control.key);
    return item ? { preview: item.text.replace(/\$\([^)]*\)/g, '').trim(), color: itemColor(item), colorPicker: true } : {};
}

function controlState(control) {
    const value = getSetting(control.key);
    return {
        ...control,
        ...(control.kind === 'visibility' ? statusBarPreview(control) : {}),
        value: control.kind === 'visibility' ? isShown(value) : value,
        children: control.children && control.children.map(controlState),
    };
}

/** Built-in status bar buttons offered when filling a category; the copy runs the same VS Code command. */
function builtinCommands() {
    return STATUS_BAR_ITEMS.map(item => ({
        label: item.text.replace(/\$\([^)]*\)/g, '').trim(),
        command: builtinShellCommand(item.command) || item.tooltip,
        vscodeCommand: item.command,
        color: itemColor(item),
    }));
}

/** Current values of every control, sent to the webview. */
function buildPanelState() {
    return {
        sections: SECTIONS.map(section => ({ ...section, controls: section.controls.map(controlState) })),
        customCommands: getSetting('customCommandsList') || [],
        customCommandGroups: getSetting('customCommandGroups') || [],
        colorized: Boolean(getSetting('colorized')),
        colorizedCustom: Boolean(getSetting('colorizedCustomCommands')),
        gitMenuIcon: getSetting('customGitMenuIcon') !== 'hide',
        flavors: flavorTitles(),
        flavorConfig: getFlavorConfig(),
        builtinCommands: builtinCommands(),
        generatorInstalled: isGeneratorInstalled(),
    };
}

/** Finds the control the webview wants to change, so it can only write known settings. */
function findControl(key) {
    const visit = controls => {
        for (const control of controls) {
            if (control.key === key) {
                return control;
            }
            const child = control.children && visit(control.children);
            if (child) {
                return child;
            }
        }
        return undefined;
    };
    return visit(SECTIONS.flatMap(section => section.controls));
}

/** Converts a value from the webview to what is stored in settings.json. */
function toStoredValue(control, value) {
    switch (control.kind) {
        case 'boolean':
            return Boolean(value);
        case 'visibility':
            return value ? 'show' : 'hide';
        case 'text':
            return String(value);
        default:
            return undefined;
    }
}

function collectKeys(controls, keys = []) {
    for (const control of controls) {
        if (control.key) {
            keys.push(control.key);
        }
        if (control.children) {
            collectKeys(control.children, keys);
        }
    }
    return keys;
}

/** Setting keys the panel can export and import. */
function panelSettingKeys() {
    return collectKeys(SECTIONS.flatMap(section => section.controls));
}

module.exports = {
    buildPanelState,
    findControl,
    toStoredValue,
    panelSettingKeys,
};
