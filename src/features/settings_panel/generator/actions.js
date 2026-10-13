const vscode = require('vscode');
const { GENERATOR_EXTENSION_ID } = require('../../../constants');
const { isExtensionInstalled } = require('../../../utils/extensions');

const GENERATOR_COMMANDS = {
    menu: 'simpler_flutter_generator.openMenu',
    studio: 'simpler_flutter_generator.openConfigurator',
};

function isGeneratorInstalled() {
    return isExtensionInstalled(GENERATOR_EXTENSION_ID);
}

async function openGenerator(page) {
    const command = GENERATOR_COMMANDS[page];
    if (!command) {
        return;
    }
    if (!isGeneratorInstalled()) {
        await openGeneratorMarketplace();
        vscode.window.showInformationMessage(
            'To use this, please install Simpler Flutter Generator.\nЧтобы пользоваться, пожалуйста, установите Simpler Flutter Generator.',
        );
        return;
    }
    await vscode.commands.executeCommand(command);
}

/** Shows the extension in the built-in Extensions view and opens its details page. */
async function openGeneratorMarketplace() {
    await vscode.commands.executeCommand('workbench.extensions.search', `@id:${GENERATOR_EXTENSION_ID}`);
    try {
        await vscode.commands.executeCommand('extension.open', GENERATOR_EXTENSION_ID);
    } catch {
        // The details page needs the extension in the editor's gallery; the Extensions view stays open anyway.
    }
}

/** Handles webview messages of the generator card; returns false for messages it does not own. */
async function handleGeneratorMessage(message) {
    switch (message.type) {
        case 'openGenerator':
            await openGenerator(message.page);
            return true;
        case 'openGeneratorMarketplace':
            await openGeneratorMarketplace();
            return true;
        default:
            return false;
    }
}

module.exports = {
    isGeneratorInstalled,
    handleGeneratorMessage,
};
