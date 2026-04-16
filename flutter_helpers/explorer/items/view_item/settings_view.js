const vscode = require('vscode')

/// Simpler Flutter Tasks Extension
let flutterClean = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('flutterCleanIcon');
let flutterPubGetIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('flutterPubGetIcon');
let buildApkIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('buildApkIcon');
let iosIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('iosIcon');
let ipaIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('ipaIcon');
let buildRunnerIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('buildRunnerIcon');
let installIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('installIcon');
let openApkIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('openApkIcon');
let gitPullIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('gitPullIcon');
let smallApkIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('smallApkIcon');
let spiderBuildIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('spiderBuildIcon');
let easyLocalizationsIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('easyLocalizationsIcon');
let treeViewCopyText = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('treeViewCopyText');
let createNewTerminal = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('createNewTerminal');
let localeOne = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('easyLocalizationFirst');
let localeSecond = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('easyLocalizationSecond');
let openIosIconSettings = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('openIosIcon');
let openIpaIconSettings = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('openIpaIcon');
let colorizedCommand = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('colorized');
//Custom Commands 
let customCommandsList = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('customCommandsList');
//Flutter flutterFlavor 
let flutterFlavor = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('flutterFlavor');

//other settings
let buildRunnerCategoryExpandableIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('buildRunnerCategoryExpandable');
let flutterCategoryExpandable = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('flutterCategoryExpandable');
let androidCategoryExpandable = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('androidCategoryExpandable');
let iosCategoryExpandable = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('iosCategoryExpandable');
let gitCategoryExpandable = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('gitCategoryExpandable');

/// Simpler Flutter Snippets Extension
let simplerFlutterSnippetsWrapper = vscode.workspace.getConfiguration('SimplerFlutterSnippets').get('WrapperOnMenu');
const config = vscode.workspace.getConfiguration('SimplerFlutterSnippets');
let snippetsValueListenableBuilder = config.get('ValueListenableBuilder')
let snippetsFutureBuilder = config.get('FutureBuilder')
let snippetsStateFullBuilder = config.get('StateFullBuilder')
let snippetsTweenBuilder = config.get('TweenBuilder')
let snippetsStreamBuilder = config.get('StreamBuilder')
let snippetsSingleChildScrollViewBuilder = config.get('SingleChildScrollViewBuilder')
let snippetsAnimatedBuilder = config.get('AnimatedBuilder')
let snippetsStackBuilder = config.get('WrapperStack')
let snippetsCubitBuilder = config.get('CubitBuilder')
let snippetsCubitConsumer = config.get('CubitConsumer')
let snippetsRemoveThisWidgetCommand = config.get('removeThisWidget')

/// Simpler Flutter Generator Extension
let simplerFlutterGeneratorCreateWidget = vscode.workspace.getConfiguration('SimplerFlutterGenerator').get('createStateWidget');
let simplerFlutterGeneratorBlocType = vscode.workspace.getConfiguration('bloc').get('newBlocTemplate.type');
let simplerFlutterGeneratorCubitType = vscode.workspace.getConfiguration('bloc').get('newCubitTemplate.type');
let simplerFlutterGeneratorStateWidget = vscode.workspace.getConfiguration('SimplerFlutterGenerator').get('stateWidget');

//settings configs
const setttingsTasksConfig = vscode.workspace.getConfiguration('SimplerFlutterTasks')
const setttingsSnippetsWrapper = vscode.workspace.getConfiguration('SimplerFlutterSnippets')
const setttingsGeneratorExtension = vscode.workspace.getConfiguration('SimplerFlutterGenerator')

//settings configs BLOC
const settingsBlocType = vscode.workspace.getConfiguration('bloc')

// -- From settings json update
vscode.workspace.onDidChangeConfiguration((event) => {
    // -- Flutter Comands
    if (event.affectsConfiguration('SimplerFlutterTasks.flutterCleanIcon')) {
        flutterClean = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('flutterCleanIcon');
    }
    if (event.affectsConfiguration('SimplerFlutterTasks.flutterPubGetIcon')) {
        flutterPubGetIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('flutterPubGetIcon');

    }
    if (event.affectsConfiguration('SimplerFlutterTasks.buildApkIcon')) {
        buildApkIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('buildApkIcon');

    }
    if (event.affectsConfiguration('SimplerFlutterTasks.iosIcon')) {
        iosIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('iosIcon');

    }
    if (event.affectsConfiguration('SimplerFlutterTasks.ipaIcon')) {
        ipaIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('ipaIcon');

    }
    if (event.affectsConfiguration('SimplerFlutterTasks.buildRunnerIcon')) {
        buildRunnerIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('buildRunnerIcon');

    }
    if (event.affectsConfiguration('SimplerFlutterTasks.installIcon')) {
        installIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('installIcon');

    }
    if (event.affectsConfiguration('SimplerFlutterTasks.openApkIcon')) {
        openApkIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('openApkIcon');

    }
    if (event.affectsConfiguration('SimplerFlutterTasks.gitPullIcon')) {
        gitPullIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('gitPullIcon');

    }
    if (event.affectsConfiguration('SimplerFlutterTasks.smallApkIcon')) {
        smallApkIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('smallApkIcon');

    }
    if (event.affectsConfiguration('SimplerFlutterTasks.spiderBuildIcon')) {
        spiderBuildIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('spiderBuildIcon');

    }
    if (event.affectsConfiguration('SimplerFlutterTasks.easyLocalizationsIcon')) {
        easyLocalizationsIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('easyLocalizationsIcon');

    }
    if (event.affectsConfiguration('SimplerFlutterTasks.treeViewCopyText')) {
        treeViewCopyText = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('treeViewCopyText');

    }
    if (event.affectsConfiguration('SimplerFlutterTasks.createNewTerminal')) {
        createNewTerminal = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('createNewTerminal');
    }
    if (event.affectsConfiguration('SimplerFlutterTasks.easyLocalizationFirst') || event.affectsConfiguration('SimplerFlutterTasks.easyLocalizationSecond')) {
        localeOne = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('easyLocalizationFirst');
        localeSecond = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('easyLocalizationSecond');
    }


    if (event.affectsConfiguration('SimplerFlutterTasks.openIosIcon') || event.affectsConfiguration('SimplerFlutterTasks.openIpaIcon')) {
        openIosIconSettings = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('openIosIcon');
        openIpaIconSettings = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('openIpaIcon');
    }

    if (event.affectsConfiguration('SimplerFlutterTasks.colorized')) {
        colorizedCommand = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('colorized');
    }
    if (event.affectsConfiguration('SimplerFlutterTasks.customCommandsList')) {
        customCommandsList = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('customCommandsList');
    }
    if (event.affectsConfiguration('SimplerFlutterTasks.flutterFlavor')) {
        flutterFlavor = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('flutterFlavor');
    }
    if (event.affectsConfiguration('SimplerFlutterTasks.buildRunnerCategoryExpandable') ||
        event.affectsConfiguration('SimplerFlutterTasks.flutterCategoryExpandable') ||
        event.affectsConfiguration('SimplerFlutterTasks.androidCategoryExpandable') ||
        event.affectsConfiguration('SimplerFlutterTasks.iosCategoryExpandable') ||
        event.affectsConfiguration('SimplerFlutterTasks.gitCategoryExpandable')
    ) {
        buildRunnerCategoryExpandableIcon = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('buildRunnerCategoryExpandable');
        flutterCategoryExpandable = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('flutterCategoryExpandable');
        androidCategoryExpandable = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('androidCategoryExpandable');
        iosCategoryExpandable = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('iosCategoryExpandable');
        gitCategoryExpandable = vscode.workspace.getConfiguration('SimplerFlutterTasks').get('gitCategoryExpandable');
    }

    /// Simpler Flutter Snippets
    if (event.affectsConfiguration('SimplerFlutterSnippets.WrapperOnMenu')) {
        simplerFlutterSnippetsWrapper = vscode.workspace.getConfiguration('SimplerFlutterSnippets').get('WrapperOnMenu');
    }

    if (event.affectsConfiguration('SimplerFlutterSnippets.ValueListenableBuilder') ||
        event.affectsConfiguration('SimplerFlutterSnippets.FutureBuilder') ||
        event.affectsConfiguration('SimplerFlutterSnippets.StateFullBuilder') ||
        event.affectsConfiguration('SimplerFlutterSnippets.TweenBuilder') ||
        event.affectsConfiguration('SimplerFlutterSnippets.StreamBuilder') ||
        event.affectsConfiguration('SimplerFlutterSnippets.SingleChildScrollViewBuilder') ||
        event.affectsConfiguration('SimplerFlutterSnippets.AnimatedBuilder') ||
        event.affectsConfiguration('SimplerFlutterSnippets.WrapperStack') ||
        event.affectsConfiguration('SimplerFlutterSnippets.CubitBuilder') ||
        event.affectsConfiguration('SimplerFlutterSnippets.CubitConsumer') ||
        event.affectsConfiguration('SimplerFlutterSnippets.removeThisWidget')
    ) {
        snippetsValueListenableBuilder = vscode.workspace.getConfiguration('SimplerFlutterSnippets').get('ValueListenableBuilder')
        snippetsFutureBuilder = vscode.workspace.getConfiguration('SimplerFlutterSnippets').get('FutureBuilder')
        snippetsStateFullBuilder = vscode.workspace.getConfiguration('SimplerFlutterSnippets').get('StateFullBuilder')
        snippetsTweenBuilder = vscode.workspace.getConfiguration('SimplerFlutterSnippets').get('TweenBuilder')
        snippetsStreamBuilder = vscode.workspace.getConfiguration('SimplerFlutterSnippets').get('StreamBuilder')
        snippetsSingleChildScrollViewBuilder = vscode.workspace.getConfiguration('SimplerFlutterSnippets').get('SingleChildScrollViewBuilder')
        snippetsAnimatedBuilder = vscode.workspace.getConfiguration('SimplerFlutterSnippets').get('AnimatedBuilder')
        snippetsStackBuilder = vscode.workspace.getConfiguration('SimplerFlutterSnippets').get('WrapperStack')
        snippetsCubitBuilder = vscode.workspace.getConfiguration('SimplerFlutterSnippets').get('CubitBuilder')
        snippetsCubitConsumer = vscode.workspace.getConfiguration('SimplerFlutterSnippets').get('CubitConsumer')
        snippetsRemoveThisWidgetCommand = vscode.workspace.getConfiguration('SimplerFlutterSnippets').get('removeThisWidget')

    }

    /// Simpler Flutter Generators
    if (event.affectsConfiguration('SimplerFlutterGenerator.createStateWidget')) {
        simplerFlutterGeneratorCreateWidget = vscode.workspace.getConfiguration('SimplerFlutterGenerator').get('createStateWidget');

    }
    if (
        event.affectsConfiguration('bloc.newBlocTemplate.type') ||
        event.affectsConfiguration('bloc.newCubitTemplate.type')

    ) {
        simplerFlutterGeneratorBlocType = vscode.workspace.getConfiguration('bloc').get('newBlocTemplate.type');
        simplerFlutterGeneratorCubitType = vscode.workspace.getConfiguration('bloc').get('newCubitTemplate.type');

    }
    if (event.affectsConfiguration('SimplerFlutterGenerator.stateWidget')) {
        simplerFlutterGeneratorStateWidget = vscode.workspace.getConfiguration('SimplerFlutterGenerator').get('stateWidget');
    }
});



function settingsViewItem(context) {
    return {
        label: 'Settings',
        iconPath: vscode.Uri.file(context.asAbsolutePath('flutter_helpers/explorer/assets/main_settings_icon.gif')),
        // iconPath: new vscode.ThemeIcon('settings-gear'),
        children: [
            {
                label: 'Copy the Command',
                checkboxState: treeViewCopyText ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                description: '',
                bool: true,
                contextValue: 'settings',
                settingsConfig: setttingsTasksConfig,
                config: 'treeViewCopyText',
            },
            {
                label: 'Always start on a new terminal',
                checkboxState: createNewTerminal ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                description: '',
                bool: true,
                editing: true,
                contextValue: 'settings',
                settingsConfig: setttingsTasksConfig,
                config: 'createNewTerminal',
                startCommand: 'flutter build apk'
            },
            {
                label: 'Colorized The Commands',
                checkboxState: colorizedCommand ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                description: '',
                bool: true,
                contextValue: 'settings',
                settingsConfig: setttingsTasksConfig,
                config: 'colorized',
            },
            {
                label: 'Status Bar Icons',
                iconPath: vscode.Uri.file(context.asAbsolutePath('flutter_helpers/explorer/assets/status_bar_icons.gif')),
                collapsibleState: vscode.TreeItemCollapsibleState.Expanded,
                children: [
                    {
                        label: '1) Flutter Clean',
                        contextValue: 'settings',
                        config: 'flutterCleanIcon',
                        settingsConfig: setttingsTasksConfig,
                        checkboxState: showIcon(flutterClean) ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                        description: '',
                    },
                    {
                        label: '2) Flutter Pub get',
                        contextValue: 'settings',
                        config: 'flutterPubGetIcon',
                        settingsConfig: setttingsTasksConfig,
                        checkboxState: showIcon(flutterPubGetIcon) ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                        description: '',
                    },
                    {
                        label: '3) Flutter Build Apk',
                        contextValue: 'settings',
                        config: 'buildApkIcon',
                        settingsConfig: setttingsTasksConfig,
                        checkboxState: showIcon(buildApkIcon) ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                        description: '',
                    },
                    {
                        label: '4) Flutter Build Ios',
                        contextValue: 'settings',
                        config: 'iosIcon',
                        settingsConfig: setttingsTasksConfig,
                        checkboxState: showIcon(iosIcon) ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                        description: '',
                    },
                    {
                        label: '5) Flutter Build Ipa',
                        contextValue: 'settings',
                        config: 'ipaIcon',
                        settingsConfig: setttingsTasksConfig,
                        checkboxState: showIcon(ipaIcon) ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                        description: '',
                    },
                    {
                        label: '6) Build Runner',
                        contextValue: 'settings',
                        config: 'buildRunnerIcon',
                        settingsConfig: setttingsTasksConfig,
                        checkboxState: showIcon(buildRunnerIcon) ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                        description: '',
                    },
                    {
                        label: '7) Flutter Install',
                        contextValue: 'settings',
                        config: 'installIcon',
                        settingsConfig: setttingsTasksConfig,
                        checkboxState: showIcon(installIcon) ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                        description: '',
                    },
                    {
                        label: '8) Open Apk Folder',
                        contextValue: 'settings',
                        config: 'openApkIcon',
                        settingsConfig: setttingsTasksConfig,
                        checkboxState: showIcon(openApkIcon) ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                        description: '',
                    },
                    {
                        label: '9) Git Pull',
                        contextValue: 'settings',
                        config: 'gitPullIcon',
                        settingsConfig: setttingsTasksConfig,
                        checkboxState: showIcon(gitPullIcon) ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                        description: '',
                    },
                    {
                        label: '10) Small Apk',
                        contextValue: 'settings',
                        config: 'smallApkIcon',
                        settingsConfig: setttingsTasksConfig,
                        checkboxState: showIcon(smallApkIcon) ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                        description: '',
                    },
                    {
                        label: '11) Spider Build',
                        contextValue: 'settings',
                        config: 'spiderBuildIcon',
                        settingsConfig: setttingsTasksConfig,
                        checkboxState: showIcon(spiderBuildIcon) ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                        description: '',
                    },
                    {
                        label: '12) Open IOS Folder',
                        contextValue: 'settings',
                        config: 'openIosIcon',
                        settingsConfig: setttingsTasksConfig,
                        checkboxState: showIcon(openIosIconSettings) ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                        description: '',
                    },
                    {
                        label: '13) Open IPA Folder',
                        contextValue: 'settings',
                        config: 'openIpaIcon',
                        settingsConfig: setttingsTasksConfig,
                        checkboxState: showIcon(openIpaIconSettings) ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                        description: '',
                    },
                    {
                        label: '14) Create Your Custom Commands 🛠️',
                        config: 'customCommandsList',
                        contextValue: 'customCommands',
                        customCommands: true,
                        checkboxState: customCommandsList.length !== 0 ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                        description: '',
                        settingsConfig: setttingsTasksConfig,
                    },
                    {
                        label: '15) Flutter Flavor',
                        contextValue: 'settings',
                        config: 'flutterFlavor',
                        settingsConfig: setttingsTasksConfig,
                        checkboxState: showIcon(flutterFlavor) ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                        description: '',
                    },
                    {
                        label: '16) Easy Localizations',
                        contextValue: 'settings',
                        config: 'easyLocalizationsIcon',
                        collapsibleState: vscode.TreeItemCollapsibleState.Expanded,
                        settingsConfig: setttingsTasksConfig,
                        checkboxState: showIcon(easyLocalizationsIcon) ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                        description: '',
                        children: showIcon(easyLocalizationsIcon) ? [
                            {
                                label: localeOne,
                                config: 'easyLocalizationFirst',
                                settingsConfig: setttingsTasksConfig,
                                contextValue: 'easyLocale',
                                argument: localeOne,
                                bool: true,
                                iconPath: vscode.Uri.file(context.asAbsolutePath('flutter_helpers/explorer/assets/sub_set.gif')),
                                description: '',
                            },
                            {
                                label: localeSecond,
                                config: 'easyLocalizationSecond',
                                settingsConfig: setttingsTasksConfig,
                                contextValue: 'easyLocale',
                                argument: localeSecond,
                                bool: true,
                                iconPath: vscode.Uri.file(context.asAbsolutePath('flutter_helpers/explorer/assets/sub_set.gif')),
                                description: '',
                            }
                        ] : undefined
                    },
                ],
            },
            {
                label: 'Simpler Flutter Snippets',
                description: '- New Extension -',
                iconPath: vscode.Uri.file(context.asAbsolutePath('flutter_helpers/explorer/assets/other_extensions_settings_six.gif')),
                children: [
                    {
                        label: 'Show Wrappers On Context Menu',
                        config: 'WrapperOnMenu',
                        contextValue: 'settings',
                        settingsConfig: setttingsSnippetsWrapper,
                        checkInstalled: 'Eldiyar-Dev.simpler-flutter-snippets',
                        checkboxState: showIcon(simplerFlutterSnippetsWrapper) ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                        description: '',
                    },
                    showIcon(simplerFlutterSnippetsWrapper) ?
                        {
                            label: 'Wrappers',
                            iconPath: vscode.Uri.file(context.asAbsolutePath('flutter_helpers/explorer/assets/sub_set.gif')),
                            collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
                            children: [
                                {
                                    label: 'Value Builder Listenable',
                                    config: 'ValueListenableBuilder',
                                    settingsConfig: config,
                                    checkInstalled: 'Eldiyar-Dev.simpler-flutter-snippets',
                                    contextValue: 'settings',
                                    bool: true,
                                    checkboxState: snippetsValueListenableBuilder ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                                    description: '',
                                },
                                {
                                    label: 'Future Builder',
                                    config: 'FutureBuilder',
                                    settingsConfig: config,
                                    checkInstalled: 'Eldiyar-Dev.simpler-flutter-snippets',
                                    contextValue: 'settings',
                                    bool: true,
                                    checkboxState: snippetsFutureBuilder ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                                    description: '',
                                },
                                {
                                    label: 'State Full Builder',
                                    config: 'StateFullBuilder',
                                    settingsConfig: config,
                                    checkInstalled: 'Eldiyar-Dev.simpler-flutter-snippets',
                                    contextValue: 'settings',
                                    bool: true,
                                    checkboxState: snippetsStateFullBuilder ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                                    description: '',
                                },
                                {
                                    label: 'Tween Builder',
                                    config: 'TweenBuilder',
                                    settingsConfig: config,
                                    checkInstalled: 'Eldiyar-Dev.simpler-flutter-snippets',
                                    contextValue: 'settings',
                                    bool: true,
                                    checkboxState: snippetsTweenBuilder ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                                    description: '',
                                },
                                {
                                    label: 'Stream Builder',
                                    config: 'StreamBuilder',
                                    settingsConfig: config,
                                    checkInstalled: 'Eldiyar-Dev.simpler-flutter-snippets',
                                    contextValue: 'settings',
                                    bool: true,
                                    checkboxState: snippetsStreamBuilder ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                                    description: '',
                                },
                                {
                                    label: 'SingleChildScrollViewBuilder',
                                    config: 'SingleChildScrollViewBuilder',
                                    settingsConfig: config,
                                    checkInstalled: 'Eldiyar-Dev.simpler-flutter-snippets',
                                    contextValue: 'settings',
                                    bool: true,
                                    checkboxState: snippetsSingleChildScrollViewBuilder ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                                    description: '',
                                },
                                {
                                    label: 'AnimatedBuilder',
                                    config: 'AnimatedBuilder',
                                    settingsConfig: config,
                                    checkInstalled: 'Eldiyar-Dev.simpler-flutter-snippets',
                                    contextValue: 'settings',
                                    bool: true,
                                    checkboxState: snippetsAnimatedBuilder ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                                    description: '',
                                },
                                {
                                    label: 'Stack Wrapper',
                                    config: 'WrapperStack',
                                    settingsConfig: config,
                                    checkInstalled: 'Eldiyar-Dev.simpler-flutter-snippets',
                                    contextValue: 'settings',
                                    bool: true,
                                    checkboxState: snippetsStackBuilder ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                                    description: '',
                                },
                                {
                                    label: 'Cubit Builder Wrapper',
                                    config: 'CubitBuilder',
                                    settingsConfig: config,
                                    checkInstalled: 'Eldiyar-Dev.simpler-flutter-snippets',
                                    contextValue: 'settings',
                                    bool: true,
                                    checkboxState: snippetsCubitBuilder ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                                    description: '',
                                },
                                {
                                    label: 'Cubit Consumer Wrapper',
                                    config: 'CubitConsumer',
                                    settingsConfig: config,
                                    checkInstalled: 'Eldiyar-Dev.simpler-flutter-snippets',
                                    contextValue: 'settings',
                                    bool: true,
                                    checkboxState: snippetsCubitConsumer ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                                    description: '',
                                },
                                {
                                    label: 'Short Cut Remove Widget',
                                    config: 'removeThisWidget',
                                    settingsConfig: config,
                                    checkInstalled: 'Eldiyar-Dev.simpler-flutter-snippets',
                                    contextValue: 'settings',
                                    bool: true,
                                    checkboxState: snippetsRemoveThisWidgetCommand ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                                    description: '',
                                },

                            ],
                        } : undefined

                ],
            },
            {
                label: 'Simpler Flutter Generators',
                iconPath: vscode.Uri.file(context.asAbsolutePath('flutter_helpers/explorer/assets/other_extensions_settings_seven_2.gif')),
                description: '- Extension -',
                children: [
                    //*Cubit TYPE
                    {
                        label: 'Cubit Type',
                        iconPath: vscode.Uri.file(context.asAbsolutePath('flutter_helpers/explorer/assets/sub_set.gif')),
                        collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
                        children: [
                            {
                                label: 'Auto',
                                bool: true,
                                contextValue: 'settings',
                                blocTypeUse: "auto",
                                config: 'newCubitTemplate.type',
                                settingsConfig: settingsBlocType,
                                checkboxState: simplerFlutterGeneratorCubitType === 'auto' ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                                description: '',
                            },
                            {
                                label: 'simple',
                                bool: true,
                                contextValue: 'settings',
                                blocTypeUse: 'simple',
                                config: 'newCubitTemplate.type',
                                settingsConfig: settingsBlocType,
                                checkboxState: simplerFlutterGeneratorCubitType === 'simple' ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                                description: '',
                            },
                            {
                                label: 'equatable',
                                bool: true,
                                contextValue: 'settings',
                                blocTypeUse: 'equatable',
                                config: 'newCubitTemplate.type',
                                settingsConfig: settingsBlocType,
                                checkboxState: simplerFlutterGeneratorCubitType === 'equatable' ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                                description: '',
                            },
                            {
                                label: 'freezed',
                                bool: true,
                                contextValue: 'settings',
                                blocTypeUse: 'freezed',
                                config: 'newCubitTemplate.type',
                                settingsConfig: settingsBlocType,
                                checkboxState: simplerFlutterGeneratorCubitType === 'freezed' ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                                description: '',
                            },

                        ],
                    },
                    //*BLOC TYPE
                    {
                        label: 'Bloc Type',
                        iconPath: vscode.Uri.file(context.asAbsolutePath('flutter_helpers/explorer/assets/sub_set.gif')),
                        collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
                        children: [
                            {
                                label: 'Auto',
                                bool: true,
                                contextValue: 'settings',
                                blocTypeUse: "auto",
                                config: 'newBlocTemplate.type',
                                settingsConfig: settingsBlocType,
                                checkboxState: simplerFlutterGeneratorBlocType === 'auto' ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                                description: '',
                            },
                            {
                                label: 'simple',
                                bool: true,
                                contextValue: 'settings',
                                blocTypeUse: 'simple',
                                config: 'newBlocTemplate.type',
                                settingsConfig: settingsBlocType,
                                checkboxState: simplerFlutterGeneratorBlocType === 'simple' ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                                description: '',
                            },
                            {
                                label: 'equatable',
                                bool: true,
                                contextValue: 'settings',
                                blocTypeUse: 'equatable',
                                config: 'newBlocTemplate.type',
                                settingsConfig: settingsBlocType,
                                checkboxState: simplerFlutterGeneratorBlocType === 'equatable' ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                                description: '',
                            },
                            {
                                label: 'freezed',
                                bool: true,
                                contextValue: 'settings',
                                blocTypeUse: 'freezed',
                                config: 'newBlocTemplate.type',
                                settingsConfig: settingsBlocType,
                                checkboxState: simplerFlutterGeneratorBlocType === 'freezed' ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                                description: '',
                            },

                        ],
                    },
                    {
                        label: 'State Widget',
                        iconPath: vscode.Uri.file(context.asAbsolutePath('flutter_helpers/explorer/assets/sub_set.gif')),
                        children: [
                            {
                                label: 'Create State Widget',
                                config: 'createStateWidget',
                                bool: true,
                                contextValue: 'settings',
                                checkInstalled: 'Eldiyar-Dev.simpler-flutter-generator',
                                settingsConfig: setttingsGeneratorExtension,
                                checkboxState: simplerFlutterGeneratorCreateWidget ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                                description: '',
                            },
                            simplerFlutterGeneratorCreateWidget ?

                                {
                                    label: 'State Widget Type',
                                    iconPath: vscode.Uri.file(context.asAbsolutePath('flutter_helpers/explorer/assets/sub_set.gif')),
                                    collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
                                    children: [
                                        {
                                            label: 'State Less Widget',
                                            config: 'stateWidget',
                                            contextValue: 'settings',
                                            bool: true,
                                            checkInstalled: 'Eldiyar-Dev.simpler-flutter-generator',
                                            blocTypeUse: 'StateLessWidget',
                                            settingsConfig: setttingsGeneratorExtension,
                                            checkboxState: simplerFlutterGeneratorStateWidget === 'StateLessWidget' ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                                            description: '',
                                        },
                                        {
                                            label: 'State Full Widget',
                                            config: 'stateWidget',
                                            contextValue: 'settings',
                                            bool: true,
                                            checkInstalled: 'Eldiyar-Dev.simpler-flutter-generator',
                                            blocTypeUse: 'StateFullWidget',
                                            settingsConfig: setttingsGeneratorExtension,
                                            checkboxState: simplerFlutterGeneratorStateWidget === 'StateFullWidget' ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                                            description: '',
                                        },

                                        {
                                            label: 'Do Not Create',
                                            config: 'stateWidget',
                                            contextValue: 'settings',
                                            bool: true,
                                            checkInstalled: 'Eldiyar-Dev.simpler-flutter-generator',
                                            blocTypeUse: 'Empty',
                                            settingsConfig: setttingsGeneratorExtension,
                                            checkboxState: simplerFlutterGeneratorStateWidget === 'Empty' ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                                            description: '',
                                        },
                                    ],
                                } : undefined
                        ],
                    }
                ],
            },
            {
                label: 'Activate Custom Commands',
                iconPath: vscode.Uri.file(context.asAbsolutePath('flutter_helpers/explorer/assets/settings_800.gif')),
                children: [
                    {
                        label: 'Create Your Custom Commands',
                        config: 'customCommandsList',
                        contextValue: 'customCommands',
                        customCommands: true,
                        checkboxState: customCommandsList.length !== 0 ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                        iconPath: vscode.Uri.file(context.asAbsolutePath('flutter_helpers/explorer/assets/sub_set.gif')),
                        description: '',
                        settingsConfig: setttingsTasksConfig,
                    },
                ],
            },
            {
                label: 'Other Settings',
                iconPath: vscode.Uri.file(context.asAbsolutePath('flutter_helpers/explorer/assets/other_settings.gif')),
                children: [
                    {
                        label: ' --- Make Always Expanded when start VisualStudio Code --- ',
                        command: 'flutterCmd.executeCmd',
                        copyText: false,
                        description: '',
                        contextValue: 'gitHubContext'
                    },
                    {
                        label: 'Build Runner',
                        config: 'buildRunnerCategoryExpandable',
                        contextValue: 'settings',
                        iconPath: vscode.Uri.file(context.asAbsolutePath('flutter_helpers/explorer/assets/wired-outline-1418-rhombus.gif')),
                        settingsConfig: setttingsTasksConfig,
                        bool: true,
                        checkboxState: buildRunnerCategoryExpandableIcon ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                        description: '',
                    },
                    {
                        label: 'Flutter',
                        config: 'flutterCategoryExpandable',
                        contextValue: 'settings',
                        iconPath: vscode.Uri.file(context.asAbsolutePath('flutter_helpers/explorer/assets/wired-outline-1418-rhombus.gif')),
                        settingsConfig: setttingsTasksConfig,
                        bool: true,
                        checkboxState: flutterCategoryExpandable ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                        description: '',
                    },
                    {
                        label: 'Android',
                        config: 'androidCategoryExpandable',
                        contextValue: 'settings',
                        iconPath: vscode.Uri.file(context.asAbsolutePath('flutter_helpers/explorer/assets/wired-outline-1418-rhombus.gif')),
                        settingsConfig: setttingsTasksConfig,
                        bool: true,
                        checkboxState: androidCategoryExpandable ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                        description: '',
                    },
                    {
                        label: 'Ios',
                        config: 'iosCategoryExpandable',
                        contextValue: 'settings',
                        iconPath: vscode.Uri.file(context.asAbsolutePath('flutter_helpers/explorer/assets/wired-outline-1418-rhombus.gif')),
                        settingsConfig: setttingsTasksConfig,
                        bool: true,
                        checkboxState: iosCategoryExpandable ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                        description: '',
                    },
                    {
                        label: 'GitHub',
                        config: 'gitCategoryExpandable',
                        contextValue: 'settings',
                        iconPath: vscode.Uri.file(context.asAbsolutePath('flutter_helpers/explorer/assets/wired-outline-1418-rhombus.gif')),
                        settingsConfig: setttingsTasksConfig,
                        bool: true,
                        checkboxState: gitCategoryExpandable ? vscode.TreeItemCheckboxState.Checked : vscode.TreeItemCheckboxState.Unchecked,
                        description: '',
                    },
                ],
            },
        ],
    }
}



function showIcon(params) {
    if (params === 'show') {
        return true
    } else {
        return false
    }
}

module.exports = {
    settingsViewItem
}