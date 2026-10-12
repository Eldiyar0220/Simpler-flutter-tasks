const vscode = require('vscode');
const {
    COMPANION_EXTENSIONS,
    CONFIG_SECTION,
    SNIPPETS_CONFIG_SECTION,
    GENERATOR_CONFIG_SECTION,
} = require('../../constants');
const { getSetting, updateGlobalSetting } = require('../../utils/config');
const { isExtensionInstalled, installExtension } = require('../../utils/extensions');
const { showTimedNotification } = require('../../utils/notifications');
const { runInTerminal } = require('../../utils/terminal');
const { DEFAULT_CUSTOM_COMMANDS } = require('../status_bar/custom_commands');
const { CommandsTreeDataProvider } = require('./tree_data_provider');
const { commandsViewItems, explorerViewItems } = require('./items');

const COMMANDS_VIEW_ID = 'flutter-Commands';
const EXPLORER_VIEW_ID = 'flutterView';

/** Settings that change what the trees show. */
const WATCHED_SECTIONS = [
    CONFIG_SECTION,
    SNIPPETS_CONFIG_SECTION,
    GENERATOR_CONFIG_SECTION,
    'bloc.newBlocTemplate.type',
    'bloc.newCubitTemplate.type',
];

function registerExplorer(context) {
    const commandsProvider = new CommandsTreeDataProvider(() => commandsViewItems(context));
    const explorerProvider = new CommandsTreeDataProvider(() => explorerViewItems(context));
    const refreshAll = () => {
        commandsProvider.refresh();
        explorerProvider.refresh();
    };

    const commandsView = vscode.window.createTreeView(COMMANDS_VIEW_ID, {
        treeDataProvider: commandsProvider,
        showCollapseAll: true,
    });

    // Remembers the user's custom commands while the feature is switched off, to restore them later.
    const customCommandsBackup = { list: undefined };

    context.subscriptions.push(
        commandsView,
        vscode.window.registerTreeDataProvider(EXPLORER_VIEW_ID, explorerProvider),

        vscode.workspace.onDidChangeConfiguration(event => {
            if (WATCHED_SECTIONS.some(section => event.affectsConfiguration(section))) {
                refreshAll();
            }
        }),

        commandsView.onDidChangeSelection(async event => {
            const selected = event.selection[0];
            if (selected && selected.argument && getSetting('treeViewCopyText')) {
                await vscode.env.clipboard.writeText(selected.argument);
                showTimedNotification(`Copied: ${selected.argument} ✅`, 10);
            }
        }),

        commandsView.onDidChangeCheckboxState(event => onCheckboxChanged(event, customCommandsBackup)),

        vscode.commands.registerCommand('flutter-tasks.refreshEntry', () => {
            try {
                refreshAll();
                showTimedNotification('Refreshed ✅', 10);
            } catch (error) {
                showTimedNotification(`Refresh Error ${error}❌`, 10);
            }
        }),

        vscode.commands.registerCommand('flutter-tasks.editLocale', async item => {
            const newCommand = await vscode.window.showInputBox({
                placeHolder: 'Edit Start Command',
                value: item.argument,
            });
            if (newCommand !== undefined) {
                await updateGlobalSetting(item.setting.key, newCommand, item.setting.section);
                refreshAll();
            }
        }),

        vscode.commands.registerCommand('flutter-tasks.activateCustomCommands', async () => {
            try {
                await vscode.commands.executeCommand('workbench.action.openSettingsJson');
                const current = getSetting('customCommandsList') || [];
                if (current.length === 0 || hasItems(customCommandsBackup.list)) {
                    await updateGlobalSetting('customCommandsList', restoreCustomCommands(customCommandsBackup));
                } else {
                    vscode.window.showInformationMessage('You are already using Custom Commands ✅');
                }
            } catch (error) {
                vscode.window.showErrorMessage(String(error));
            }
        }),

        vscode.commands.registerCommand('flutter-tasks.copyTheCommand', async item => {
            if (item && item.argument !== undefined) {
                await vscode.env.clipboard.writeText(item.argument);
                showTimedNotification('Copied ✅', 10);
            }
        }),
    );

    // Same action, separate ids so package.json can show different inline icons.
    for (const id of ['flutter-tasks.runTheCommand', 'flutter-tasks.screenShot', 'flutter-tasks.doctor']) {
        context.subscriptions.push(vscode.commands.registerCommand(id, runItemCommand));
    }
}

function runItemCommand(item) {
    if (item && item.argument !== undefined) {
        runInTerminal(item.argument);
        showTimedNotification(`Running: ${item.argument} ✅`, 40);
    }
}

function hasItems(list) {
    return Array.isArray(list) && list.length !== 0;
}

function restoreCustomCommands(backup) {
    const list = hasItems(backup.list) ? backup.list : DEFAULT_CUSTOM_COMMANDS;
    backup.list = undefined;
    return list;
}

async function onCheckboxChanged(event, customCommandsBackup) {
    const [item, state] = event.items[0];
    const checked = state === vscode.TreeItemCheckboxState.Checked;

    if (item.requiresExtension && !isExtensionInstalled(item.requiresExtension)) {
        try {
            const name = COMPANION_EXTENSIONS[item.requiresExtension];
            const selected = await vscode.window.showInformationMessage(`Install ${name} ✅?`, { modal: true }, 'Install');
            if (selected === 'Install') {
                await installExtension(item.requiresExtension);
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error.message}`);
        }
    }

    const setting = item.setting;
    if (!setting) {
        showTimedNotification('Error: something wrong ❌', 20);
        return;
    }

    try {
        switch (setting.kind) {
            case 'boolean':
                await updateGlobalSetting(setting.key, checked, setting.section);
                break;
            case 'visibility':
                await updateGlobalSetting(setting.key, checked ? 'show' : 'hide', setting.section);
                break;
            case 'choice':
                await updateGlobalSetting(setting.key, setting.value, setting.section);
                break;
            case 'customCommands':
                if (checked) {
                    await vscode.commands.executeCommand('workbench.action.openSettingsJson');
                    await updateGlobalSetting(setting.key, restoreCustomCommands(customCommandsBackup), setting.section);
                } else {
                    customCommandsBackup.list = getSetting(setting.key, setting.section);
                    await updateGlobalSetting(setting.key, [], setting.section);
                }
                break;
        }
    } catch (error) {
        showTimedNotification(`Checkbox is unchecked ${error} ❌`, 20);
    }
}

module.exports = {
    registerExplorer,
};
