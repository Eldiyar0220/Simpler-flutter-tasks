const vscode = require('vscode');
const { getSetting } = require('./config');
const { getWorkspaceRoot } = require('./workspace');

const DEFAULT_TERMINAL_NAME = 'Simpler Flutter Tasks (Unique)';
const NUMBERED_TERMINAL_REGEX = /^Simpler Flutter Tasks (\d+)$/;

let lastTerminalIndex = 0;

/**
 * Sends `command` to a terminal. With `confirm` the user is asked first.
 * Reuses the first open terminal unless "createNewTerminal" is enabled.
 */
async function runInTerminal(command, confirm = false) {
    if (confirm) {
        const choice = await vscode.window.showWarningMessage(
            `Simpler Flutter Tasks\nВы уверены, что хотите продолжить?\n\n"${command}"`,
            { modal: true },
            'YES',
        );
        if (choice !== 'YES') {
            return;
        }
    }

    const terminals = vscode.window.terminals;
    let terminal;
    if (getSetting('createNewTerminal') && terminals.length > 0) {
        terminal = createTerminal(nextNumberedTerminalName(terminals));
    } else if (terminals.length === 0) {
        terminal = createTerminal(DEFAULT_TERMINAL_NAME);
    } else {
        terminal = terminals[0];
    }

    terminal.show();
    terminal.sendText(command);
}

function createTerminal(name) {
    return vscode.window.createTerminal({ cwd: getWorkspaceRoot(), name });
}

function nextNumberedTerminalName(terminals) {
    lastTerminalIndex++;
    for (const terminal of terminals) {
        const match = terminal.name.match(NUMBERED_TERMINAL_REGEX);
        if (match) {
            lastTerminalIndex = parseInt(match[1], 10) + 1;
        }
    }
    return `Simpler Flutter Tasks ${lastTerminalIndex}`;
}

module.exports = {
    runInTerminal,
};
