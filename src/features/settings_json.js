const vscode = require('vscode');
const { showTimedNotification } = require('../utils/notifications');

function openSettingsJson() {
    vscode.commands.executeCommand('workbench.action.openSettingsJson');
    showTimedNotification('Openning Settings Json: ✅', 10);
}

function registerSettingsJsonCommands(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand('flutter-tasks.openSettingsJson', openSettingsJson),
        vscode.commands.registerCommand('flutter-tasks.openSettingsJsonWithIcon', openSettingsJson),
    );
}

module.exports = {
    registerSettingsJsonCommands,
};
