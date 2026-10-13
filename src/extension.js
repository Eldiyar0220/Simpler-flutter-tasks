const vscode = require('vscode');
const { registerWelcome, showWelcomeOrWhatsNew } = require('./features/welcome');
const { registerStatusBarCommands } = require('./features/status_bar/status_bar_commands');
const { registerStatusBarItems } = require('./features/status_bar/status_bar_items');
const { registerCustomCommands } = require('./features/status_bar/custom_commands');
const { registerCommandsMenu } = require('./features/status_bar/commands_menu');
const { registerFlavorCommands } = require('./features/flavor');
const { registerExplorer } = require('./features/explorer/explorer');
const { registerSettingsJsonCommands } = require('./features/settings_json');
const { registerSettingsPanel } = require('./features/settings_panel/settings_panel');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    // Explorer first so the sidebar never stays on "Loading Settings..." if something later throws.
    // Do not install companion extensions here: `installExtension` can restart or stall the host.
    for (const [label, register] of [
        ['explorer', registerExplorer],
        ['status bar commands', registerStatusBarCommands],
        ['flavor', registerFlavorCommands],
        ['commands menu', registerCommandsMenu],
        ['status bar items', registerStatusBarItems],
        ['custom commands', registerCustomCommands],
        ['settings json', registerSettingsJsonCommands],
        ['settings panel', registerSettingsPanel],
        ['welcome', registerWelcome],
    ]) {
        try {
            register(context);
        } catch (error) {
            console.error(`Simpler Flutter Tasks: ${label}`, error);
            vscode.window.showErrorMessage(`Simpler Flutter Tasks: ${label}: ${error}`);
        }
    }

    setTimeout(() => {
        try {
            void showWelcomeOrWhatsNew(context);
        } catch (error) {
            vscode.window.showErrorMessage(`Simpler Flutter Tasks: ${error}`);
        }
    }, 0);
}

function deactivate() { }

module.exports = {
    activate,
    deactivate,
};


// При каждом релизе, после npm run release:


// npx ovsx publish -p ТВОЙ_ТОКЕН