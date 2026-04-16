
const vscode = require('vscode');
const { spawn } = require('child_process');
const path = require('path');
const { flutterApk } = require('../open_flutter_apk');
const fs = require('fs');
const { showInformationWithProgressAndTimeout } = require('../loading');

async function openApkFlavor(env) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const workspaceFolder = workspaceFolders && workspaceFolders.length > 0 ? workspaceFolders[0].uri.fsPath : undefined;
    if (workspaceFolder) {
        let apkPath = path.join(workspaceFolder, 'build', 'app', 'outputs', 'flutter-apk', `app-${env}-release.apk`);
        if (fs.existsSync(apkPath)) {
            let openCommand;
            if (process.platform === 'darwin') {
                openCommand = 'open';
                apkPath = path.join(workspaceFolder, 'build', 'app', 'outputs', 'flutter-apk', `app-${env}-release.apk`);
            } else if (process.platform === 'win32') {
                openCommand = 'explorer';
                apkPath = path.join(workspaceFolder, 'build', 'app', 'outputs', 'flutter-apk');
            } else {
                openCommand = 'xdg-open';
                apkPath = path.join(workspaceFolder, 'build', 'app', 'outputs', 'flutter-apk');
            }


            const openProcess = spawn(openCommand ?? 'open', [process.platform === 'darwin' ? ['-R'] : '', apkPath]);
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
                    showInformationWithProgressAndTimeout('Can not Find apk', 40)
                    flutterApk()
                }
            });
        } else {
            vscode.window.showInformationMessage(`app-${env.toLowerCase()}-release.apk not found !! ❌`)
            flutterApk()
        }
    }
}

module.exports = {
    openApkFlavor
};
