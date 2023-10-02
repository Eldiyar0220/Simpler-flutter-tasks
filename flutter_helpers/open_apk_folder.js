
const vscode = require('vscode');
const { spawn } = require('child_process');
const path = require('path');
const { openOutPuts } = require('./open_outputs');
const fs = require('fs');
const { showInformationWithProgressAndTimeout } = require('./loading');

async function buildApkAndOpenFolder() {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	const workspaceFolder = workspaceFolders && workspaceFolders.length > 0 ? workspaceFolders[0].uri.fsPath : undefined;
	if (workspaceFolder) {
		const apkPath = path.join(workspaceFolder, 'build', 'app', 'outputs', 'flutter-apk', 'app-release.apk');
		if (fs.existsSync(apkPath)) {
			const openProcess = spawn('open', ['-R', apkPath]);
			openProcess.stdout.on('data', (data) => {
				console.log(`stdout here: ${data}`);
			});

			openProcess.stderr.on('data', (data) => {
				console.error(`stderr: ${data}`);
			});

			openProcess.on('close', (code) => {
				if (code === 0) {
					showInformationWithProgressAndTimeout('Opening', 10)
				} else {
					showInformationWithProgressAndTimeout('does not exists', 40)

				}
			});
		} else {
			vscode.window.showInformationMessage('flutter-apk OR app-release.apk not found !!')
			openOutPuts()
		}
	}
}


module.exports = {
	buildApkAndOpenFolder
};