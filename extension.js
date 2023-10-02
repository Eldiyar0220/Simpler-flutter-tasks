
const vscode = require('vscode');
const { executeFlutterCommand } = require('./flutter_helpers/open_terminal');
const { showInformationWithProgressAndTimeout } = require('./flutter_helpers/loading');
const { buildApkAndOpenFolder } = require('./flutter_helpers/open_apk_folder');
//tokens
/**
 * node_modules/.bin/vsce COMMAND ARGS
 * @param {vscode.ExtensionContext} context
*/
function activate(context) {
	//* clean
	context.subscriptions.push(
		vscode.commands.registerCommand('flutter-tasks.clean', () => {
			executeFlutterCommand('flutter clean')
			showInformationWithProgressAndTimeout("Project is cleaning", 20)
		})

	);
	//*pub Get
	context.subscriptions.push(
		vscode.commands.registerCommand('flutter-tasks.pubGet', () => {
			executeFlutterCommand('flutter pub get');
			showInformationWithProgressAndTimeout('Pub getting', 30)
		})
	);
	//*build APK
	context.subscriptions.push(
		vscode.commands.registerCommand('flutter-tasks.buildApk', () => {
			executeFlutterCommand('flutter build apk')
			showInformationWithProgressAndTimeout('Building APK', 30)
		})

	);
	//*build IOS
	context.subscriptions.push(
		vscode.commands.registerCommand('flutter-tasks.ios', async () => {
			executeFlutterCommand('flutter build ios')
			showInformationWithProgressAndTimeout('Building IOS', 30)
		})

	);
	//*build ipa
	context.subscriptions.push(
		vscode.commands.registerCommand('flutter-tasks.ipa', async () => {
			executeFlutterCommand('flutter build ipa')
			showInformationWithProgressAndTimeout('Building IPA', 30)
		})

	);
	//*build runner
	context.subscriptions.push(
		vscode.commands.registerCommand('flutter-tasks.buildRunner', async () => {
			executeFlutterCommand('dart run build_runner build --delete-conflicting-outputs')
			showInformationWithProgressAndTimeout('Build Running', 30)
		})

	);

	//*open Apk Folder
	context.subscriptions.push(
		vscode.commands.registerCommand('flutter-tasks.openApkFolder', buildApkAndOpenFolder,)

	);



	//*icons
	showStatusBarItem();
}

function showStatusBarItem() {
	// Create a status bar item  
	// --------Flutter clean-----------------------------------------------------------------------------------------------
	const statusBarItem1 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	statusBarItem1.text = "Flutter clean";
	statusBarItem1.command = "flutter-tasks.clean";
	statusBarItem1.color = 'red';
	statusBarItem1.show();
	// --------pub get-----------------------------------------------------------------------------------------------------
	const statusBarItem2 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	statusBarItem2.text = "Pub get";
	statusBarItem2.command = "flutter-tasks.pubGet";
	statusBarItem2.color = '#02ff0f';
	statusBarItem2.show();
	// --------build apk---------------------------------------------------------------------------------------------------
	const statusBarItem3 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	statusBarItem3.text = "Build apk $(pulse)";
	statusBarItem3.command = "flutter-tasks.buildApk";
	statusBarItem3.color = '#c8ff02';
	statusBarItem3.show();
	// --------build ios---------------------------------------------------------------------------------------------------
	const statusBarItem4 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	statusBarItem4.text = "Build ios $(pulse)";
	statusBarItem4.command = "flutter-tasks.ios";
	statusBarItem4.color = '#ff02ee';
	statusBarItem4.show();
	// --------build ipa---------------------------------------------------------------------------------------------------
	const statusBarItem5 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	statusBarItem5.text = "Build ipa $(pulse)";
	statusBarItem5.command = "flutter-tasks.ipa";
	statusBarItem5.color = '#ff9900';
	statusBarItem5.show();
	// --------build runner------------------------------------------------------------------------------------------------
	const statusBarItem6 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	statusBarItem6.text = "$(fold-up) Build Runner $(fold-up)";
	statusBarItem6.command = "flutter-tasks.buildRunner";
	statusBarItem6.color = '#04ffff';
	statusBarItem6.show();
	// --------build apk---------------------------------------------------------------------------------------------------
	const statusBarItem7 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	statusBarItem7.text = "Open Apk Folder $(link-external)";
	statusBarItem7.command = "flutter-tasks.openApkFolder";
	statusBarItem7.color = '#06f002';
	statusBarItem7.show();
}



module.exports = {
	activate,
	deactivate
}


function deactivate() { }