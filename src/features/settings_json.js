const vscode = require('vscode');
const { showTimedNotification } = require('../utils/notifications');

let extensionContext;

function userSettingsUri() {
    return vscode.Uri.joinPath(extensionContext.globalStorageUri, '..', '..', 'settings.json');
}

/** Opens the real User/settings.json. Avoid `openSettingsJson` — it can freeze the host from a webview. */
async function revealUserSettingsJson() {
    const uri = userSettingsUri();
    try {
        const document = await vscode.workspace.openTextDocument(uri);
        await vscode.window.showTextDocument(document, { preview: false });
    } catch {
        void vscode.commands.executeCommand('workbench.action.openSettingsJson');
    }
}

function openSettingsJson() {
    setTimeout(() => {
        void revealUserSettingsJson().then(() => {
            showTimedNotification('Openning Settings Json: ✅', 10);
        });
    }, 0);
}

function registerSettingsJsonCommands(context) {
    extensionContext = context;
    context.subscriptions.push(
        vscode.commands.registerCommand('flutter-tasks.openSettingsJson', openSettingsJson),
        vscode.commands.registerCommand('flutter-tasks.openSettingsJsonWithIcon', openSettingsJson),
    );
}

module.exports = {
    registerSettingsJsonCommands,
    revealUserSettingsJson,
};
