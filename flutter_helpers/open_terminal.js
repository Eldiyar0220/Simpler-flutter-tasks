
const vscode = require('vscode');

function executeFlutterCommand(command) {
	// Get all currently open terminals
	const terminals = vscode.window.terminals;
	///show if hidden
	vscode.commands.executeCommand('workbench.action.terminal.toggleTerminal');

	if (terminals.length === 0) {
		// If there are no open terminals, create a new one
		const workspaceFolder = vscode.workspace.workspaceFolders[0];
		const terminal = vscode.window.createTerminal({
			cwd: workspaceFolder.uri.fsPath,
			name: 'Flutter terminal'
		});

		// Show the terminal
		terminal.show();

		// Send the command to the terminal
		terminal.sendText(command);
	} else {
		// If there is an open terminal, use the first one
		const terminal = terminals[0];
		terminal.show();
		// Send the command to the terminal
		terminal.sendText(command);
	}
	
}

module.exports = {
	executeFlutterCommand
};