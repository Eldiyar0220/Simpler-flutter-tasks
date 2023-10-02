const vscode = require('vscode');
const { executeFlutterCommand } = require('./open_terminal');
const { openOutPuts } = require('./open_outputs');

function showNotificationWithYesNoButtons(messageInfo, command) {
	const options = {
		modal: true,
	};


	vscode.window.showInformationMessage(messageInfo, options, 'Build APK', 'Open outputs')
		.then((selectedButton) => {
			if (selectedButton === 'Build APK') {
				executeFlutterCommand(command)
			} else if (selectedButton === 'Open outputs') {
				openOutPuts()
			}
		});
}


module.exports = {
	showNotificationWithYesNoButtons,
};