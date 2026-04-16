
const vscode = require('vscode');
const { showInformationWithProgressAndTimeout } = require('../loading');
const { executeFlutterCommand } = require('../open_terminal');
const { buildApkAndOpenFolder } = require('../open_apk_folder');
const { buildIOSAndOpenFolder } = require('../open_ios_folder');
const { buildAppBundleAndOpenFolder } = require('../open_app_bundle_folder');
const { flavorFunc } = require('../flavor/flutter_flavor_icon');

//* --------- Icon's commands
function statusBarCommands(context) {
    //* clean
    context.subscriptions.push(
        vscode.commands.registerCommand('flutter-tasks.clean', () => {
            if (process.platform === 'darwin') {
                executeFlutterCommand('flutter clean && flutter pub get')
            } else if (process.platform === 'win32') {
                executeFlutterCommand('flutter clean | flutter pub get')
            } else {
                executeFlutterCommand('flutter clean && flutter pub get')
            }

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
        vscode.commands.registerCommand('flutter-tasks.openApkFolder',
            buildApkAndOpenFolder,
        )
    );
    /// ----------------------------------------------------------------------------------------------------
    //*open IOS Folder
    context.subscriptions.push(
        vscode.commands.registerCommand('flutter-tasks.openIosFolder',
            buildIOSAndOpenFolder,
        )
    );
    //*open IPA Folder
    context.subscriptions.push(
        vscode.commands.registerCommand('flutter-tasks.openIpaFolder', () => {
            buildIOSAndOpenFolder(true)
        })
    );

    // The Tree View
    context.subscriptions.push(
        vscode.commands.registerCommand('flutter-tasks.openIos', (item) => {
            buildIOSAndOpenFolder(item.ios)

        })
    );

    // The Tree View bundle
    context.subscriptions.push(
        vscode.commands.registerCommand('flutter-tasks.openbundleFolder', buildAppBundleAndOpenFolder)
    );


    /// ----------------------------------------------------------------------------------------------------

    //*install
    context.subscriptions.push(
        vscode.commands.registerCommand('flutter-tasks.install', () => {
            executeFlutterCommand('flutter install')
            showInformationWithProgressAndTimeout('Installing', 70)
        },)

    );

    //*git pull
    context.subscriptions.push(
        vscode.commands.registerCommand('flutter-tasks.gitPull', () => {
            executeFlutterCommand('git pull')
            showInformationWithProgressAndTimeout('Pulling', 70)
        },)

    );

    //*Small Apk
    context.subscriptions.push(
        vscode.commands.registerCommand('flutter-tasks.smallApk', () => {
            executeFlutterCommand('flutter build apk --split-per-abi')
            showInformationWithProgressAndTimeout('Building Small Apk', 70)
        },)

    );

    //*Spider build
    context.subscriptions.push(
        vscode.commands.registerCommand('flutter-tasks.spiderBuild', () => {
            executeFlutterCommand('spider build')
            showInformationWithProgressAndTimeout('Spider chu chu', 70)
        },)

    );

    //*Easy Localizations
    let localeFirst = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('easyLocalizationFirst');
    let localeSecond = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('easyLocalizationSecond');
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration((event) => {
            if (event.affectsConfiguration('SimplerFlutterTasks.easyLocalizationFirst') || event.affectsConfiguration('SimplerFlutterTasks.easyLocalizationSecond')) {
                localeFirst = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('easyLocalizationFirst');
                localeSecond = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('easyLocalizationSecond');
            }
        }));
    context.subscriptions.push(
        vscode.commands.registerCommand('flutter-tasks.locale', () => {
            executeFlutterCommand(localeFirst)
            setTimeout(() => {
                executeFlutterCommand(localeSecond)
            }, 3000);

            showInformationWithProgressAndTimeout(`Locale 1 -> Successfully ✅`, 30)
            setTimeout(() => {
                showInformationWithProgressAndTimeout(`Locale 2 -> Successfully ✅ ✅`, 30)
            }, 2300);

        },)

    );

    //*Flutter Flavor 15
    try {
        context.subscriptions.push(flavorFunc(context));
    } catch (error) {
        console.error(error)
    }

}

function isShowIcon(params) {
    if (params === 'show') {
        return true
    } else {
        return false
    }
}

let colorizedCommand = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('colorized');

vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration('SimplerFlutterTasks.colorized')) {
        colorizedCommand = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('colorized');
        showInformationWithProgressAndTimeout(`Colorized Updated ✅`, 16)
    }
});

//* --------- Icons
function showStatusBarItem() {
    // Create a status bar item  
    // --------Flutter clean-----------------------------------------------------------------------------------------------
    const statusBarItem1 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    const hideCleanIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('flutterCleanIcon');
    vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration('SimplerFlutterTasks.flutterCleanIcon')) {
            const hideCleanIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('flutterCleanIcon');
            showInformationWithProgressAndTimeout(`Clean Icon is ${hideCleanIcon} ${isShowIcon(hideCleanIcon) ? '✅' : '❌'}`, 15)
            if (hideCleanIcon === "show") {
                statusBarItem1.show();

            } else if (hideCleanIcon === "hide") {
                statusBarItem1.hide();
            }
        }
        if (event.affectsConfiguration('SimplerFlutterTasks.colorized')) {
            statusBarItem1.color = colorizedCommand ? 'red' : '#ffffff';
        }
    });

    if (hideCleanIcon == "show") {
        statusBarItem1.show();
    } else if (hideCleanIcon == "hide") {
        statusBarItem1.hide();
    }
    statusBarItem1.text = "Flutter clean $(notebook-delete-cell)";
    statusBarItem1.command = "flutter-tasks.clean";
    statusBarItem1.tooltip = 'Flutter clean';
    statusBarItem1.color = colorizedCommand ? 'red' : '#ffffff';
    // --------pub get-----------------------------------------------------------------------------------------------------
    const statusBarItem2 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    const hidePubGetIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('flutterPubGetIcon');
    vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration('SimplerFlutterTasks.flutterPubGetIcon')) {
            const hidePubGetIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('flutterPubGetIcon');
            showInformationWithProgressAndTimeout(`Pub Get Icon is "${hidePubGetIcon}" ${isShowIcon(hidePubGetIcon) ? '✅' : '❌'}`, 15)
            if (hidePubGetIcon === "show") {
                statusBarItem2.show();
            } else if (hidePubGetIcon === "hide") {
                statusBarItem2.hide();
            } sdf
        }
        if (event.affectsConfiguration('SimplerFlutterTasks.colorized')) {
            statusBarItem2.color = colorizedCommand ? '#02ff0f' : '#ffffff';
        }
    });

    if (hidePubGetIcon == "show") {
        statusBarItem2.show();
    } else if (hidePubGetIcon == "hide") {
        statusBarItem2.hide();
    }
    statusBarItem2.text = "Pub get";
    statusBarItem2.command = "flutter-tasks.pubGet";
    statusBarItem2.color = colorizedCommand ? '#02ff0f' : '#ffffff';
    statusBarItem2.tooltip = 'Flutter pub get';
    // --------build apk---------------------------------------------------------------------------------------------------
    const statusBarItem3 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    const hideApkIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('buildApkIcon');
    vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration('SimplerFlutterTasks.buildApkIcon')) {
            const hideApkIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('buildApkIcon');
            showInformationWithProgressAndTimeout(`Apk Icon is ${hideApkIcon} ${isShowIcon(hideApkIcon) ? '✅' : '❌'}`, 15)
            if (hideApkIcon === "show") {
                statusBarItem3.show();
            } else if (hideApkIcon === "hide") {
                statusBarItem3.hide();
            }
        }
        if (event.affectsConfiguration('SimplerFlutterTasks.colorized')) {
            statusBarItem3.color = colorizedCommand ? '#c8ff02' : '#ffffff';
        }
    });

    if (hideApkIcon == "show") {
        statusBarItem3.show();
    } else if (hideApkIcon == "hide") {
        statusBarItem3.hide();
    }
    statusBarItem3.text = "Build apk $(pulse)";
    statusBarItem3.command = "flutter-tasks.buildApk";
    statusBarItem3.color = colorizedCommand ? '#c8ff02' : '#ffffff';
    statusBarItem3.tooltip = 'Flutter build apk';

    // --------build ios---------------------------------------------------------------------------------------------------
    const statusBarItem4 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);

    const hideIosIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('iosIcon');
    vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration('SimplerFlutterTasks.iosIcon')) {
            const hideIosIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('iosIcon');
            showInformationWithProgressAndTimeout(`Ios Icon is ${hideIosIcon} ${isShowIcon(hideIosIcon) ? '✅' : '❌'}`, 15)
            if (hideIosIcon === "show") {
                statusBarItem4.show();
            } else if (hideIosIcon === "hide") {
                statusBarItem4.hide();
            }
        }
        if (event.affectsConfiguration('SimplerFlutterTasks.colorized')) {
            statusBarItem4.color = colorizedCommand ? '#ff02ee' : '#ffffff';
        }
    });

    if (hideIosIcon == "show") {
        statusBarItem4.show();
    } else if (hideIosIcon == "hide") {
        statusBarItem4.hide();
    }
    statusBarItem4.text = "Build ios $(pulse)";
    statusBarItem4.command = "flutter-tasks.ios";
    statusBarItem4.color = colorizedCommand ? '#ff02ee' : '#ffffff';
    statusBarItem4.tooltip = 'Flutter build ios';


    // --------build ipa---------------------------------------------------------------------------------------------------
    const statusBarItem5 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    const hideIpaIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('ipaIcon');
    vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration('SimplerFlutterTasks.ipaIcon')) {
            const hideIpaIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('ipaIcon');
            showInformationWithProgressAndTimeout(`Ipa Icon is ${hideIpaIcon} ${isShowIcon(hideIpaIcon) ? '✅' : '❌'}`, 15)
            if (hideIpaIcon === "show") {
                statusBarItem5.show();
            } else if (hideIpaIcon === "hide") {
                statusBarItem5.hide();
            }
        }
        if (event.affectsConfiguration('SimplerFlutterTasks.colorized')) {
            statusBarItem5.color = colorizedCommand ? '#ff9900' : '#ffffff';
        }
    });

    if (hideIpaIcon == "show") {
        statusBarItem5.show();
    } else if (hideIpaIcon == "hide") {
        statusBarItem5.hide();
    }
    statusBarItem5.text = "Build ipa $(pulse)";
    statusBarItem5.command = "flutter-tasks.ipa";
    statusBarItem5.color = colorizedCommand ? '#ff9900' : '#ffffff';
    statusBarItem5.tooltip = 'Flutter build ipa';

    // --------build runner------------------------------------------------------------------------------------------------
    const statusBarItem6 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    const hideBuildRunnerIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('buildRunnerIcon');
    vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration('SimplerFlutterTasks.buildRunnerIcon')) {
            const hideBuildRunnerIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('buildRunnerIcon');
            showInformationWithProgressAndTimeout(`Build Runner Icon is ${hideBuildRunnerIcon} ${isShowIcon(hideBuildRunnerIcon) ? '✅' : '❌'}`, 15)
            if (hideBuildRunnerIcon === "show") {
                statusBarItem6.show();
            } else if (hideBuildRunnerIcon === "hide") {
                statusBarItem6.hide();
            }
        }
        if (event.affectsConfiguration('SimplerFlutterTasks.colorized')) {
            statusBarItem6.color = colorizedCommand ? '#04ffff' : '#ffffff';
        }
    });

    if (hideBuildRunnerIcon == "show") {
        statusBarItem6.show();
    } else if (hideBuildRunnerIcon == "hide") {
        statusBarItem6.hide();
    }
    statusBarItem6.text = "$(fold-up) Build Runner $(fold-up)";
    statusBarItem6.command = "flutter-tasks.buildRunner";
    statusBarItem6.color = colorizedCommand ? '#04ffff' : '#ffffff';
    statusBarItem6.tooltip = 'dart run build_runner build --delete-conflicting-outputs';

    // --------Open Apk-----------------------------------------------------------------------------------------------------

    const statusBarItem7 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    const hideOpenApkFolderIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('openApkIcon');
    vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration('SimplerFlutterTasks.openApkIcon')) {
            const hideOpenApkFolderIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('openApkIcon');
            showInformationWithProgressAndTimeout(`Open Apk Icon is ${hideOpenApkFolderIcon} ${isShowIcon(hideOpenApkFolderIcon) ? '✅' : '❌'}`, 15)
            if (hideOpenApkFolderIcon === "show") {
                statusBarItem7.show();
            } else if (hideOpenApkFolderIcon === "hide") {
                statusBarItem7.hide();
            }
        }
        if (event.affectsConfiguration('SimplerFlutterTasks.colorized')) {
            statusBarItem7.color = colorizedCommand ? '#06f002' : '#ffffff';
        }
    });

    if (hideOpenApkFolderIcon == "show") {
        statusBarItem7.show();
    } else if (hideOpenApkFolderIcon == "hide") {
        statusBarItem7.hide();
    }
    statusBarItem7.text = "Open Apk Folder $(link-external)";
    statusBarItem7.command = "flutter-tasks.openApkFolder";
    statusBarItem7.color = colorizedCommand ? '#06f002' : '#ffffff';
    statusBarItem7.tooltip = 'open folder -R .....';


    // --------Open IOS-----------------------------------------------------------------------------------------------------

    const statusBarItem13 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    const hideOpenIOSFolderIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('openIosIcon');
    vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration('SimplerFlutterTasks.openIosIcon')) {
            const hideOpenIOSFolderIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('openIosIcon');
            showInformationWithProgressAndTimeout(`Open Ios Icon is ${hideOpenIOSFolderIcon} ${isShowIcon(hideOpenIOSFolderIcon) ? '✅' : '❌'}`, 15)
            if (hideOpenIOSFolderIcon === "show") {
                statusBarItem13.show();
            } else if (hideOpenIOSFolderIcon === "hide") {
                statusBarItem13.hide();
            }
        }
        if (event.affectsConfiguration('SimplerFlutterTasks.colorized')) {
            statusBarItem13.color = colorizedCommand ? '#ff02ee' : '#ffffff';
        }
    });

    if (hideOpenIOSFolderIcon == "show") {
        statusBarItem13.show();
    } else if (hideOpenIOSFolderIcon == "hide") {
        statusBarItem13.hide();
    }
    statusBarItem13.text = "Open IOS Folder $(link-external)";
    statusBarItem13.command = "flutter-tasks.openIosFolder";
    statusBarItem13.color = colorizedCommand ? '#ff02ee' : '#ffffff';
    statusBarItem13.tooltip = 'open folder -R .....';

    // --------Open Ipa-----------------------------------------------------------------------------------------------------

    const statusBarItem14 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    const hideOpenIPAFolderIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('openIpaIcon');
    vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration('SimplerFlutterTasks.openIpaIcon')) {
            const hideOpenIPAFolderIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('openIpaIcon');
            showInformationWithProgressAndTimeout(`Open Ios Icon is ${hideOpenIPAFolderIcon} ${isShowIcon(hideOpenIPAFolderIcon) ? '✅' : '❌'}`, 15)
            if (hideOpenIPAFolderIcon === "show") {
                statusBarItem14.show();
            } else if (hideOpenIPAFolderIcon === "hide") {
                statusBarItem14.hide();
            }
        }
        if (event.affectsConfiguration('SimplerFlutterTasks.colorized')) {
            statusBarItem14.color = colorizedCommand ? '#ff9900' : '#ffffff';
        }
    });

    if (hideOpenIPAFolderIcon == "show") {
        statusBarItem14.show();
    } else if (hideOpenIPAFolderIcon == "hide") {
        statusBarItem14.hide();
    }
    statusBarItem14.text = "Open IPA Folder $(link-external)";
    statusBarItem14.command = "flutter-tasks.openIpaFolder";
    statusBarItem14.color = colorizedCommand ? '#ff9900' : '#ffffff';
    statusBarItem14.tooltip = 'open folder -R .....';



    // --------Install-------------------------------------------------------------------------------------------------------
    const statusBarItem8 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    const hideInstallIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('installIcon');
    vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration('SimplerFlutterTasks.installIcon')) {
            const hideInstallIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('installIcon');
            showInformationWithProgressAndTimeout(`Install Icon is ${hideInstallIcon} ${isShowIcon(hideInstallIcon) ? '✅' : '❌'}`, 15)
            if (hideInstallIcon === "show") {
                statusBarItem8.show();
            } else if (hideInstallIcon === "hide") {
                statusBarItem8.hide();
            }
        }
        if (event.affectsConfiguration('SimplerFlutterTasks.colorized')) {
            statusBarItem8.color = colorizedCommand ? '#d9ff04' : '#ffffff';
        }
    });

    if (hideInstallIcon == "show") {
        statusBarItem8.show();
    } else if (hideInstallIcon == "hide") {
        statusBarItem8.hide();
    }
    statusBarItem8.text = "Install $(smiley)";
    statusBarItem8.command = "flutter-tasks.install";
    statusBarItem8.color = colorizedCommand ? '#d9ff04' : '#ffffff';
    statusBarItem8.tooltip = 'Flutter install ✅';
    // --------Git Pull------------------------------------------------------------------------------------------------------
    const statusBarItem9 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);

    const hideGitPullIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('gitPullIcon');
    vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration('SimplerFlutterTasks.gitPullIcon')) {
            const hideGitPullIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('gitPullIcon');
            showInformationWithProgressAndTimeout(`Git Pull Icon is ${hideGitPullIcon} ${isShowIcon(hideGitPullIcon) ? '✅' : '❌'}`, 15)
            if (hideGitPullIcon === "show") {
                statusBarItem9.show();
            } else if (hideGitPullIcon === "hide") {
                statusBarItem9.hide();
            }
        }
        if (event.affectsConfiguration('SimplerFlutterTasks.colorized')) {
            statusBarItem9.color = colorizedCommand ? '#d9ff04' : '#ffffff';
        }
    });

    if (hideGitPullIcon == "show") {
        statusBarItem9.show();
    } else if (hideGitPullIcon == "hide") {
        statusBarItem9.hide();
    }

    statusBarItem9.text = "Git Pull $(smiley)";
    statusBarItem9.command = "flutter-tasks.gitPull";
    statusBarItem9.color = colorizedCommand ? '#d9ff04' : '#ffffff';
    statusBarItem9.tooltip = 'Git Pull';
    // --------flutter build apk --split-per-abi------------------------------------------------------------------------------------------------------
    const statusBarItem10 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    const hideSmallApkIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('smallApkIcon');
    vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration('SimplerFlutterTasks.smallApkIcon')) {
            const hideSmallApkIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('smallApkIcon');
            showInformationWithProgressAndTimeout(`Small Icon is ${hideSmallApkIcon} ${isShowIcon(hideSmallApkIcon) ? '✅' : '❌'}`, 15)
            if (hideSmallApkIcon === "show") {
                statusBarItem10.show();
            } else if (hideSmallApkIcon === "hide") {
                statusBarItem10.hide();
            }
        }
        if (event.affectsConfiguration('SimplerFlutterTasks.colorized')) {
            statusBarItem10.color = colorizedCommand ? '#d9ff04' : '#ffffff';
        }
    });

    if (hideSmallApkIcon == "show") {
        statusBarItem10.show();
    } else if (hideSmallApkIcon == "hide") {
        statusBarItem10.hide();
    }

    statusBarItem10.text = "Small Apk";
    statusBarItem10.command = "flutter-tasks.smallApk";
    statusBarItem10.color = colorizedCommand ? '#d9ff04' : '#ffffff';
    statusBarItem10.tooltip = 'Small Apk';
    // --------Spider----------------------------------------------------------------------------------------------------------------------------
    const statusBarItem11 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);

    const hideSpiderV1Icon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('spiderBuildIcon');
    vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration('SimplerFlutterTasks.spiderBuildIcon')) {
            const hideSpiderV1Icon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('spiderBuildIcon');
            showInformationWithProgressAndTimeout(`Spider Icon is ${hideSpiderV1Icon} ${isShowIcon(hideSpiderV1Icon) ? '✅' : '❌'}`, 15)
            if (hideSpiderV1Icon === "show") {
                statusBarItem11.show();
            } else if (hideSpiderV1Icon === "hide") {
                statusBarItem11.hide();
            }
        }
        if (event.affectsConfiguration('SimplerFlutterTasks.colorized')) {
            statusBarItem11.color = colorizedCommand ? '#d9ff04' : '#ffffff';
        }
    });

    if (hideSpiderV1Icon == "show") {
        statusBarItem11.show();
    } else if (hideSpiderV1Icon == "hide") {
        statusBarItem11.hide();
    }

    statusBarItem11.text = "Spider Build";
    statusBarItem11.command = "flutter-tasks.spiderBuild";
    statusBarItem11.color = colorizedCommand ? '#d9ff04' : '#ffffff';
    statusBarItem11.tooltip = 'Spider';
    // --------Easy Localization------------------------------------------------------------------------------------------------------------------
    const statusBarItem12 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);

    const hideLocaleV1Icon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('easyLocalizationsIcon');
    vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration('SimplerFlutterTasks.easyLocalizationsIcon')) {
            const hideLocaleV1Icon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('easyLocalizationsIcon');
            showInformationWithProgressAndTimeout(`Easy Localizations is ${hideLocaleV1Icon} ${isShowIcon(hideLocaleV1Icon) ? '✅' : '❌'}`, 15)
            if (hideLocaleV1Icon === "show") {
                statusBarItem12.show();
            } else if (hideLocaleV1Icon === "hide") {
                statusBarItem12.hide();
            }
        }
        if (event.affectsConfiguration('SimplerFlutterTasks.colorized')) {
            statusBarItem12.color = colorizedCommand ? '#f6ff00' : '#ffffff';
        }
    });

    if (hideLocaleV1Icon == "show") {
        statusBarItem12.show();
    } else if (hideLocaleV1Icon == "hide") {
        statusBarItem12.hide();
    }

    statusBarItem12.text = "LocalizationS $(github-action)";
    statusBarItem12.command = "flutter-tasks.locale";
    statusBarItem12.color = colorizedCommand ? '#f6ff00' : '#ffffff';
    statusBarItem12.tooltip = 'Easy Localizations';
    // --------Spider----------------------------------------------------------------------------------------------------------------------------
    const statusBarItem15 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);

    const flutterFlavorIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('flutterFlavor');
    vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration('SimplerFlutterTasks.flutterFlavor')) {
            const flutterFlavorIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('flutterFlavor');
            showInformationWithProgressAndTimeout(`Flavor Icon is ${flutterFlavorIcon} ${isShowIcon(flutterFlavorIcon) ? '✅' : '❌'}`, 15)
            if (flutterFlavorIcon === "show") {
                statusBarItem15.show();
            } else if (flutterFlavorIcon === "hide") {
                statusBarItem15.hide();
            }
        }
        if (event.affectsConfiguration('SimplerFlutterTasks.colorized')) {
            statusBarItem15.color = colorizedCommand ? '#d9ff04' : '#ffffff';
        }
    });

    if (flutterFlavorIcon == "show") {
        statusBarItem15.show();
    } else if (flutterFlavorIcon == "hide") {
        statusBarItem15.hide();
    }

    statusBarItem15.text = "Flutter Flavor Builder $(remote)";
    statusBarItem15.command = "flutter-tasks.flavor";
    statusBarItem15.color = colorizedCommand ? '#45fc03' : '#ffffff';
    statusBarItem15.tooltip = 'Flavor';
}


module.exports = {
    showStatusBarItem, statusBarCommands
}


