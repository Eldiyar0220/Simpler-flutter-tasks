
const vscode = require('vscode');
const helperMessage = require('./flutter_helpers/helper_message/helper.message');
const { mainExplorer } = require('./flutter_helpers/explorer/main_explorer');
// const { flavorView } = require('./flutter_helpers/flavor/find_android_flavor');
const { showStatusBarItem, statusBarCommands } = require('./flutter_helpers/status_bar_items/status_bar_item');
const { customCommands } = require('./flutter_helpers/status_bar_items/custom_commands');
const { openSettingsJson } = require('./flutter_helpers/open_settings_json/open_settings_json');
const { isExtensionInstalled } = require('./flutter_helpers/check_installed_extension');


/** 
 * @param {vscode.ExtensionContext} context
**/
//  node_modules/.bin/vsce publish    
//  node_modules/.bin/vsce login Eldiyar-Dev

function activate(context) {
	//welcome page
	try {
		if (!isExtensionInstalled('Eldiyar-Dev.simpler-flutter-snippets')) {
			vscode.commands.executeCommand('workbench.extensions.installExtension', 'Eldiyar-Dev.simpler-flutter-snippets');
		}
		if (!isExtensionInstalled('Eldiyar-Dev.simpler-flutter-generator')) {
			vscode.commands.executeCommand('workbench.extensions.installExtension', 'Eldiyar-Dev.simpler-flutter-generator');
		}
		const previousVersion = context.globalState.get(helperMessage.LAST_VERSION_KEY);
		const extensionData = vscode.extensions.getExtension('Eldiyar-Dev.simpler-flutter-tasks');
		const currentVersion = extensionData.packageJSON.version;
		helperMessage.showWelcomeOrWhatsNew(context, currentVersion, previousVersion);
	} catch (error) {
		vscode.window.showInformationMessage(`Error -> ${error}`)
	}


	//* status bar Commands
	statusBarCommands(context)

	//* status bar icons
	showStatusBarItem();

	//* Custom Commands
	customCommands()

	//* Initial setup
	mainExplorer(context)

	//* open Settings Json
	openSettingsJson()

	//* Flutter Flavor
	// flavorView()

}

module.exports = {
	activate,
	deactivate
}


function deactivate() { }



/// go to the site https://marketplace.visualstudio.com/manage/publishers/eldiyar-dev
/// or this site https://dev.azure.com/ebolotov904
/// on right top clikc the icon man
/// on choose personal access token
/// and choose marketplace to box manage