const vscode = require('vscode');
const {
    CONFIG_SECTION,
    SNIPPETS_CONFIG_SECTION,
    GENERATOR_CONFIG_SECTION,
    BLOC_CONFIG_SECTION,
    SNIPPETS_EXTENSION_ID,
    GENERATOR_EXTENSION_ID,
} = require('../../../constants');
const { getSetting, isShown } = require('../../../utils/config');
const { CONTEXT, icon, header } = require('./helpers');

const { Checked, Unchecked } = vscode.TreeItemCheckboxState;
const { Collapsed } = vscode.TreeItemCollapsibleState;

/**
 * Setting kinds handled by the checkbox handler in explorer.js:
 *  - boolean:    true / false
 *  - visibility: "show" / "hide"
 *  - choice:     writes `value` (radio-button like group)
 */
function settingItem(label, setting, checked, extra = {}) {
    return {
        label,
        contextValue: CONTEXT.setting,
        setting: { section: CONFIG_SECTION, ...setting },
        checkboxState: checked ? Checked : Unchecked,
        ...extra,
    };
}

function booleanSetting(label, key, { section = CONFIG_SECTION, ...extra } = {}) {
    return settingItem(label, { section, key, kind: 'boolean' }, getSetting(key, section), extra);
}

function choiceSetting(label, section, key, value, extra = {}) {
    return settingItem(label, { section, key, kind: 'choice', value }, getSetting(key, section) === value, extra);
}

function customCommandsSetting(label, extra = {}) {
    const list = getSetting('customCommandsList') || [];
    return {
        label,
        contextValue: CONTEXT.customCommands,
        setting: { section: CONFIG_SECTION, key: 'customCommandsList', kind: 'customCommands' },
        checkboxState: list.length !== 0 ? Checked : Unchecked,
        ...extra,
    };
}

function openSettingsPanelItem(context) {
    return {
        label: '✨ Open Settings Panel',
        description: 'all settings on one page',
        clickCommand: 'flutter-tasks.openSettingsPanel',
        iconPath: icon(context, 'main_settings_icon.gif'),
    };
}

function settingsItems(context) {
    const subSetIcon = icon(context, 'sub_set.gif');
    return {
        label: 'Settings',
        iconPath: icon(context, 'main_settings_icon.gif'),
        children: [
            booleanSetting('Copy the Command', 'treeViewCopyText'),
            booleanSetting('Always start on a new terminal', 'createNewTerminal'),
            booleanSetting('Colorized The Commands', 'colorized'),
            booleanSetting('Colorized Custom Commands', 'colorizedCustomCommands'),
            {
                label: 'Status Bar Icons',
                description: 'open settings panel',
                clickCommand: 'flutter-tasks.openSettingsPanel',
                iconPath: icon(context, 'status_bar_icons.gif'),
                section: 'statusBar',
            },
            snippetsExtensionItems(context, subSetIcon),
            generatorExtensionItems(context, subSetIcon),
            {
                label: 'Activate Custom Commands',
                iconPath: icon(context, 'settings_800.gif'),
                children: [
                    customCommandsSetting('Create Your Custom Commands', { iconPath: subSetIcon }),
                ],
            },
            categoriesExpandedItems(context),
        ],
    };
}

function snippetsExtensionItems(context, subSetIcon) {
    const section = SNIPPETS_CONFIG_SECTION;
    const requiresExtension = SNIPPETS_EXTENSION_ID;
    const wrapper = (label, key) => booleanSetting(label, key, { section, requiresExtension });
    const wrappersShown = isShown(getSetting('WrapperOnMenu', section));

    return {
        label: 'Simpler Flutter Snippets',
        description: '- New Extension -',
        iconPath: icon(context, 'other_extensions_settings_six.gif'),
        children: [
            settingItem('Show Wrappers On Context Menu', { section, key: 'WrapperOnMenu', kind: 'visibility' }, wrappersShown, { requiresExtension }),
            wrappersShown && {
                label: 'Wrappers',
                iconPath: subSetIcon,
                collapsibleState: Collapsed,
                children: [
                    wrapper('Value Builder Listenable', 'ValueListenableBuilder'),
                    wrapper('Future Builder', 'FutureBuilder'),
                    wrapper('State Full Builder', 'StateFullBuilder'),
                    wrapper('Tween Builder', 'TweenBuilder'),
                    wrapper('Stream Builder', 'StreamBuilder'),
                    wrapper('SingleChildScrollViewBuilder', 'SingleChildScrollViewBuilder'),
                    wrapper('AnimatedBuilder', 'AnimatedBuilder'),
                    wrapper('Stack Wrapper', 'WrapperStack'),
                    wrapper('Cubit Builder Wrapper', 'CubitBuilder'),
                    wrapper('Cubit Consumer Wrapper', 'CubitConsumer'),
                    wrapper('Short Cut Remove Widget', 'removeThisWidget'),
                ],
            },
        ],
    };
}

function generatorExtensionItems(context, subSetIcon) {
    const section = GENERATOR_CONFIG_SECTION;
    const requiresExtension = GENERATOR_EXTENSION_ID;
    const templateTypes = (label, key) => ({
        label,
        iconPath: subSetIcon,
        collapsibleState: Collapsed,
        children: ['auto', 'simple', 'equatable', 'freezed'].map(type =>
            choiceSetting(type === 'auto' ? 'Auto' : type, BLOC_CONFIG_SECTION, key, type)),
    });
    const createStateWidget = getSetting('createStateWidget', section);

    return {
        label: 'Simpler Flutter Generators',
        iconPath: icon(context, 'other_extensions_settings_seven_2.gif'),
        description: '- Extension -',
        children: [
            templateTypes('Cubit Type', 'newCubitTemplate.type'),
            templateTypes('Bloc Type', 'newBlocTemplate.type'),
            {
                label: 'State Widget',
                iconPath: subSetIcon,
                children: [
                    booleanSetting('Create State Widget', 'createStateWidget', { section, requiresExtension }),
                    createStateWidget && {
                        label: 'State Widget Type',
                        iconPath: subSetIcon,
                        collapsibleState: Collapsed,
                        children: [
                            choiceSetting('State Less Widget', section, 'stateWidget', 'StateLessWidget', { requiresExtension }),
                            choiceSetting('State Full Widget', section, 'stateWidget', 'StateFullWidget', { requiresExtension }),
                            choiceSetting('Do Not Create', section, 'stateWidget', 'Empty', { requiresExtension }),
                        ],
                    },
                ],
            },
        ],
    };
}

function categoriesExpandedItems(context) {
    const rhombusIcon = icon(context, 'wired-outline-1418-rhombus.gif');
    const category = (label, key) => booleanSetting(label, key, { iconPath: rhombusIcon });
    return {
        label: 'Other Settings',
        iconPath: icon(context, 'other_settings.gif'),
        children: [
            header(' --- Make Always Expanded when start VisualStudio Code --- '),
            category('Build Runner', 'buildRunnerCategoryExpandable'),
            category('Flutter', 'flutterCategoryExpandable'),
            category('Android', 'androidCategoryExpandable'),
            category('Ios', 'iosCategoryExpandable'),
            category('GitHub', 'gitCategoryExpandable'),
        ],
    };
}

module.exports = {
    openSettingsPanelItem,
    settingsItems,
};
