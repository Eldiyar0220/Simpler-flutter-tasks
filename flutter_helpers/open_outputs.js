
const vscode = require('vscode');
const { spawn } = require('child_process');
const path = require('path');
// const { showNotificationWithYesNoButtons } = require('./show_message_yes_no');
const fs = require('fs');
const { showInformationWithProgressAndTimeout } = require('./loading');
const { executeFlutterCommand } = require('./open_terminal');

function openOutPuts() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const workspaceFolder = workspaceFolders && workspaceFolders.length > 0 ? workspaceFolders[0].uri.fsPath : undefined;

    if (workspaceFolder) {
        const outPuts = path.join(workspaceFolder, 'build', 'app', 'outputs');
        if (fs.existsSync(outPuts)) {
            const openProcess = spawn('open', ['-R', outPuts]);
            openProcess.stdout.on('data', (data) => {
                console.log(`stdout here: ${data}`);
            });

            openProcess.stderr.on('data', (data) => {
                console.error(`stderrsss : ${data}`);
                showInformationWithProgressAndTimeout('Does not exists', 40)
            });

            openProcess.on('close', (code) => {
                if (code === 0) {
                    showInformationWithProgressAndTimeout('Opening Outputs', 10)
                } else {
                    showInformationWithProgressAndTimeout('Does not exists', 40)

                }
            });
        } else {
            const options = {
                modal: false,
            };
            vscode.window.showInformationMessage('Outputs does not exists !!!!!!', options, 'Build APK')
                .then((selectedButton) => {
                    if (selectedButton === 'Build APK') {
                        executeFlutterCommand('flutter build apk')
                    }
                });

        }
    }
}


module.exports = {
    openOutPuts
};