const vscode = require('vscode');
const { COMPANION_EXTENSIONS } = require('../constants');

function isExtensionInstalled(extensionId) {
    return vscode.extensions.all.some(extension => extension.id === extensionId);
}

function installExtension(extensionId) {
    return vscode.commands.executeCommand('workbench.extensions.installExtension', extensionId);
}

function installMissingCompanionExtensions() {
    for (const extensionId of Object.keys(COMPANION_EXTENSIONS)) {
        if (!isExtensionInstalled(extensionId)) {
            installExtension(extensionId);
        }
    }
}

module.exports = {
    isExtensionInstalled,
    installExtension,
    installMissingCompanionExtensions,
};
