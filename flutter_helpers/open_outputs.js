
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
            });

            openProcess.on('close', (code) => {
                if (code === 0) {
                    showInformationWithProgressAndTimeout('opening', 10)
                } else {
                    showInformationWithProgressAndTimeout('does not exists', 40)

                }
            });
        } else {
            const openProcess = spawn('open', ['-R', outPuts]);

            openProcess.stdout.on('data', (data) => {
                console.log(`stdout here: ${data}`);
            });

            openProcess.stderr.on('data', (data) => {
                console.error(`stderr-: ${data}`);
                const options = {
                    modal: false,
                };
                vscode.window.showInformationMessage('Outputs does not exists !!!!!!', options, 'Build APK', 'Build IOS',)
                    .then((selectedButton) => {
                        if (selectedButton === 'Build APK') {
                            executeFlutterCommand('flutter build apk')
                        } else if (selectedButton === 'Build IOS') {
                            executeFlutterCommand('flutter build ios')
                        } else {
                            return;
                        }
                    });
            });

            openProcess.on('close', (code) => {
                if (code === 0) {
                    showInformationWithProgressAndTimeout('opening', 10)
                } else {
                    const options = {
                        modal: true,
                    };



                    vscode.window.showInformationMessage('APK FILE does not exists, Build apk?', options, 'Build APK', 'Open outputs')
                        .then((selectedButton) => {
                            if (selectedButton === 'Build APK') {
                                executeFlutterCommand('flutter build apk')
                            } else if (selectedButton === 'Open outputs') {
                                openOutPuts()
                            }
                        });
                }
            });

        }
    }
}


module.exports = {
    openOutPuts
};