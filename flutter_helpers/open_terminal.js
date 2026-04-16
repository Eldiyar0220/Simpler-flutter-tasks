
const vscode = require('vscode');

let createNewTerminal = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('createNewTerminal');
vscode.workspace.onDidChangeConfiguration(e => {
	if (e.affectsConfiguration('SimplerFlutterTasks.createNewTerminal')) {
		createNewTerminal = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('createNewTerminal');
	}
})


async function executeFlutterCommand(command, warning) {
	console.log(`warning ${warning}`)
	if (warning) {
		// let titleBody = title !== null ? title : command;
		const choice = await vscode.window.showWarningMessage(
			`Simpler Flutter Tasks\nВы уверены, что хотите продолжить?\n\n"${command}"`,
			{ modal: true },
			...['YES']
		);

		if (choice === 'YES') {
			startCommand()
		}
	} else {
		startCommand()
	}

	function startCommand() {
		// Get all currently open terminals
		const terminals = vscode.window.terminals;
		// vscode.commands.executeCommand('workbench.action.terminal.toggleTerminal');
		if (createNewTerminal && terminals.length >= 1) {
			createNewTerminalFunction(command)
		} else {
			if (terminals.length === 0) {
				// If there are no open terminals, create a new one
				const workspaceFolder = vscode.workspace.workspaceFolders[0];
				const terminal = vscode.window.createTerminal({
					cwd: workspaceFolder.uri.fsPath,
					name: 'Simpler Flutter Tasks (Unique)'
				});
				terminal.show();
				terminal.sendText(command);
			} else {
				const terminal = terminals[0];
				terminal.show();
				terminal.sendText(command);
			}
		}
	}
}

module.exports = {
	executeFlutterCommand
};

let currentIndex = 0;

function createNewTerminalFunction(command) {
	const terminals = vscode.window.terminals;
	const workspaceFolder = vscode.workspace.workspaceFolders[0];
	currentIndex++

	for (const terminal of terminals) {
		const regex = /^Simpler Flutter Tasks (\d+)$/; // Regex to match "Simpler Flutter Tasks X"
		const match = terminal.name.match(regex);
		if (match) {
			const index = parseInt(match[1]);
			currentIndex = index;
			currentIndex++
		}
	}

	// Create a new terminal with an incremented name
	const terminal = vscode.window.createTerminal({
		cwd: workspaceFolder.uri.fsPath,
		name: `Simpler Flutter Tasks ${currentIndex}`
	});

	terminal.show();
	terminal.sendText(command);
}