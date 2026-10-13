const vscode = require('vscode');
const { modify, applyEdits } = require('jsonc-parser');
const { CONFIG_SECTION } = require('../constants');

let settingsFileUri;

/** Remembers where the User/settings.json lives (next to the extension's global storage). */
function initConfig(context) {
    settingsFileUri = vscode.Uri.joinPath(context.globalStorageUri, '..', '..', 'settings.json');
}

function userSettingsUri() {
    return settingsFileUri;
}

function getConfig(section = CONFIG_SECTION) {
    return vscode.workspace.getConfiguration(section);
}

function getSetting(key, section = CONFIG_SECTION) {
    return getConfig(section).get(key);
}

async function updateGlobalSetting(key, value, section = CONFIG_SECTION) {
    try {
        await getConfig(section).update(key, value, vscode.ConfigurationTarget.Global);
    } catch (error) {
        if (!/not a registered configuration/i.test(String(error && error.message)) || !settingsFileUri) {
            throw error;
        }
        // After an update without a window reload, VS Code does not know settings added in the new version yet.
        await writeUserSettingsFile(`${section}.${key}`, value);
    }
}

/** Edits User/settings.json in place, keeping comments and formatting. */
async function writeUserSettingsFile(fullKey, value) {
    let text = '';
    try {
        text = Buffer.from(await vscode.workspace.fs.readFile(settingsFileUri)).toString('utf8');
    } catch {
        // No settings.json yet.
    }
    if (!text.trim()) {
        text = '{}';
    }
    const formattingOptions = { insertSpaces: !/\n\t/.test(text), tabSize: 4, eol: text.includes('\r\n') ? '\r\n' : '\n' };
    const edits = modify(text, [fullKey], value, { formattingOptions });
    await vscode.workspace.fs.writeFile(settingsFileUri, Buffer.from(applyEdits(text, edits), 'utf8'));
}

/** Icon visibility settings are stored as the strings "show" / "hide". */
function isShown(value) {
    return value === 'show';
}

module.exports = {
    initConfig,
    userSettingsUri,
    getConfig,
    getSetting,
    updateGlobalSetting,
    isShown,
};
