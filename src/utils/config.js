const vscode = require('vscode');
const { CONFIG_SECTION } = require('../constants');

function getConfig(section = CONFIG_SECTION) {
    return vscode.workspace.getConfiguration(section);
}

function getSetting(key, section = CONFIG_SECTION) {
    return getConfig(section).get(key);
}

function updateGlobalSetting(key, value, section = CONFIG_SECTION) {
    return getConfig(section).update(key, value, vscode.ConfigurationTarget.Global);
}

/** Icon visibility settings are stored as the strings "show" / "hide". */
function isShown(value) {
    return value === 'show';
}

module.exports = {
    getConfig,
    getSetting,
    updateGlobalSetting,
    isShown,
};
