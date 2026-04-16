const vscode = require('vscode');

function isExtensionInstalled(extensionId) {
    const installedExtensions = vscode.extensions.all;
    for (const extension of installedExtensions) {
        if (extension.id === extensionId) {
            return true;
        }
    }
    return false;
}



module.exports = {
    isExtensionInstalled
}