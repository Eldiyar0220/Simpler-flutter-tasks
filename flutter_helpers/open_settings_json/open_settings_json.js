
const vscode = require('vscode');
const { showInformationWithProgressAndTimeout } = require('../loading');

function openSettingsJson() {
    vscode.commands.registerCommand('flutter-tasks.openSettingsJson', () => {
		vscode.commands.executeCommand('workbench.action.openSettingsJson');
		showInformationWithProgressAndTimeout(`Openning Settings Json: ✅`, 10);
	});
	vscode.commands.registerCommand('flutter-tasks.openSettingsJsonWithIcon', () => {
		vscode.commands.executeCommand('workbench.action.openSettingsJson');
		showInformationWithProgressAndTimeout(`Openning Settings Json: ✅`, 10);
	});
}




module.exports = {
    openSettingsJson
}