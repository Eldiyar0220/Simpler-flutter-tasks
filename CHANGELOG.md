# Change Log

All notable changes to the "simpler-flutter-tasks" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Released]

## Release Notes 🔥 🔥 🔥 🔥 🔥 🔥 🔥 ------- ✅

### 4.0.4
  - Fixed: "customCommandGroups is not a registered configuration" right after updating the extension — settings are saved without reloading the window
  - Smooth drag & drop in Custom Commands
    - Cards glide to their new place, categories grow and shrink smoothly
    - The moved card glows for a moment, drop zones are highlighted while dragging
    - Respects the system "reduce motion" setting

### 4.0.3
  - Categories
    - "+" and "New category" open a picker: add your own commands (as a copy) or Status Bar Icons
    - A Status Bar Icon added to a category is a 🔗 link — it runs exactly like the status bar button (asks for flavor, uses your edited command)
    - Hover a category / GIT Helps button — the tooltip is a menu of buttons, click one to run it
    - Deleting a category moves all its commands to History
  - Custom commands
    - Drag & drop to reorder and to move between categories (↑↓ arrows removed)
    - ⚠️ Confirm and ✏️ Edit first are checkboxes now
    - Hint about joining several commands with `&&`
  - History: "Clear all" button
  - GIT Helps
    - Hidden by default; turning it on adds the default git commands
    - Only the default commands are in it — a new `git …` command is not added automatically (drag it there if you want)
    - Default menu: New Branch, Commit, Rebase, Push, Go to DEV
  - Welcome / What's New: updated list, "Open Settings" button always visible

### 4.0.2
  - Published to Open VSX — available in Cursor and other VS Code forks
  - Added MIT LICENSE, smaller extension icon
  - GIT Helps keeps its own list instead of grabbing every git command

### 4.0.1
  - Flutter Flavor is editable in the Settings Panel: path, flavors, packages and menu commands
  - Default flavor package is a placeholder `com_packages_of_your_app`
  - Status bar preview: hover a chip to highlight its switch, click it to scroll to the switch
  - Status Bar Icons section is expanded by default
  - "Copy the command" (treeViewCopyText) is on by default
  - Fixed: VS Code froze when opening `{ } settings.json` from the panel
  - Export / Import settings.json buttons are hidden for now
  - Typing animation on the panel title, 3D hover on the logo

### 4.0.0 — BIG UPDATE
  - ✨ Settings Panel — all toggles, Status Bar Icons and custom commands on one page
    - Search, color pickers, left / right position, live status bar preview
    - Editable build commands (Build APK / iOS / IPA / Install / Small APK), end with `--flavor` to pick a flavor on click
  - 🚀 Commands Menu — one status bar button with every command
  - GIT Helps — New Branch, Commit, Rebase, Push in one status bar menu
  - Custom commands
    - Categories: several commands in one status bar button
    - Then-commands: run after the main one, chained with `&&`
    - History: removed commands are kept and can be restored
  - Welcome page on install and What's New on update (once per version)
  - Sidebar and code refactored into features

### 3.1.5
custom commands in user json settings\
"label": "----> (pub get)",     -----// Change label\
"command": "flutter pub get",   ----// write your any Commands\
"enabled": true,                ---// Change visibility\
"color": "#00ff15",             --// Change Color\
"position": "left",				      -// Change position\
"warningDialog": false,			   -// show confirm start the command\
"askerForCommand": false	    -// asking alert from user


  - "warningDialog": true,
  - "askerForCommand": true
### 3.1.4
  - Changed Model of Flavor 
### Old Format
```
 "SimplerFlutterTasks.Flavors":  [
        {
            "title": "prod",
            "package": "com_packages_of_your_app"
        },
        {
            "title": "staging",
            "package": "com_packages_of_your_app"
        },
        {
            "title": "dev",
            "package": "com_packages_of_your_app"
        }
    ]
```
### New Format
```
"SimplerFlutterTasks.Flavors": {
  "path": "lib/main_",
  "flavors": [
      {
          "title": "prod",
          "package": "com_packages_of_your_app"
      },
      {
          "title": "staging",
          "package": "com_packages_of_your_app"
      },
      {
          "title": "dev",
          "package": "com_packages_of_your_app"
      }
  ]
    },
```
    

### 3.1.3
  - refactor opening new terminal and added counter
  - added killing the port terminal killall -9 dart
    - Waiting for another flutter command to release the startup lock

### 3.1.2
  - added settings of Extension Simpler FLutter Snippets
    - add/remove Bloc/Cubit builder wrapper
    - add/remove Bloc/Cubit consumer wrapper
    - add/remove Stack wrapper
    - turn on/turn off remove widget short cut
    - add Builder Runner With Filter
    
### 3.1.1
  - added some new feature for Flavor
    - adb uninstall
    - adb flutter run release
    - json of flavor was changed
    - removed apple icon from top editor
    - fixed the command flutter clean for windows
    - 

### 3.1.0
  - Added Flutter Flavor
    - KeyBinding alt/option + f 
    - flutter-tasks.activateFlavor
    - Commands example default

      - PROD
        - flutter build apk --flavor prod -t lib/main_prod.dart
        - flutter build appbundle --flavor prod -t lib/main_prod.dart
        - flutter build ios --flavor prod
        - flutter build ipa --flavor prod
        - open Bundle
        - open Apk by ENV -> Flavor

        - adb install build/app/outputs/flutter-apk/app-prod-release.apk

      - Staging
        - flutter build apk --flavor staging -t lib/main_staging.dart
        - flutter build ios --flavor staging
        - flutter build ipa --flavor staging

        - open Apk by ENV -> Flavor
        - adb install build/app/outputs/flutter-apk/app-staging-release.apk

      - Dev
        - flutter build apk --flavor dev -t lib/main_dev.dart
        - flutter build ios --flavor dev
        - flutter build ipa --flavor dev

        - open Apk by ENV -> Flavor
        - adb install build/app/outputs/flutter-apk/app-dev-release.apk

  

### 3.0.8
  - Just removed Icons happy New Year 2024
  - adding information that installing 3 extension
  
### 3.0.7
  - Just Changed Icons happy New Year 2024
  - Slowed down some animation icons
  
### 3.0.6
  - New Commands  ---- > 🔥 🔥 🔥
    - Flutter ✅
      - flutter logs 
      - flutter pub cache clean | flutter pub cache repair
      - flutter downgrade YOUR_FLUTTER_VERSION
      - flutter --help --verbose

    - Android (Gradle) ✅
      - Dependencies
      - SigningReport
      - Build
      - Clean

    - IOS  ✅
      - pod setup
      - pod init
      - pod version
      - Deleting ✅
        - .symlinks
        - Pods
        - Podfile.lock
        - De integrate
      - cocoapods ✅
        - sudo gem install cocoapods
        - brew install cocoapods
        - brew upgrade cocoapods
        - brew link --overwrite cocoapods
      
    - Settings Tabs ✅

      - Other Settings
        - Always Expand  - Всегда Открытый когда запускается Visual Studio Code -
        - Always Collapsed  - Всегда Закрытый когда запускается Visual Studio Code -

      - Activate Custom Commands 

      - Settings Bloc Extension 
        - Cubit Type +
    
    - firebase's commands tab  ✅

  - Optimize Starting Ios Commands  ❌
     - For
        - WINDOWS ❌
        - LINUX ❌
        - MAC ✅

### 3.0.5
  - I Will add to Explorer tab ✅
    - without settings ✅

  - Added Colorized The Commands ✅
    - Switch between Colorized / White

### 3.0.4
  - Editing Easy Localizations ✅
  - Added descriptions for some Commands ✅
  - Add Open Ios Folder ✅
  - Add Open Ipa Folder ✅


### 3.0.3
  - Optimize Starting Ios Commands ✅ -- beta test only for MAC
    - WINDOWS ❌
    - LINUX ❌
    - MAC ✅
      - pod install
      - pod update
      - pod cache clean --all
      - pod repo update

  - Added refresh Tab's button
  - Added Collapse All Tab's button
  - Added Tab's Git Hub ✅
    - you can't start the command only COPY | it will be safer this way
      - Init Repo
      - Git Cancelers
      - Git Repo


### 3.0.2
  - adding Tab's settings ✅
    - I will add settings to my other extensions. ✅
      - `Simpler FLutter Tasks`
      - `Simpler FLutter Snippets`
      - `Simpler FLutter Generators`


      
### 3.0.1 
  - Added Tabs
    - Android ✅
    - IOS ✅
    - Copy The Command on menu View ✅
    - Start Command on menu view ✅


### 3.0.0 
  - Updated Menu Explorer 
    - added new tab `Settings` ✅
      - Hide / Show Icon -> `Now it’s convenient to change the visibility of status bar icons` ✅
      - Start + Copy The Command ✅
      - Added Numbering The Command ✅ 

### 2.8.7 
  - Auto Updating Localizations from Json, 
       now you do not have to reload vs code ✅
  - Vs Code `Menu Explorer Commands`  🔥 🔥 🔥
    - Build Runner ✅
      - dart run build_runner build
      - dart run build_runner build --delete-conflicting-outputs
      - dart run build_runner build --delete-conflicting-outputs -v
    - Flutter Commands ✅
      - flutter --version
      - flutter doctor -v
      - flutter pub outdated
      - flutter upgrade
      - flutter pub get
      - flutter pub upgrade
      - flutter devices
      - flutter analyze
      - dart fix --apply
      - dart format .
      - flutter clean
    - .... so wait for more commands....!
  
  - Optimized Code - (Commands) ✅

### 2.8.3-4-5-6
  - what's new
    - custom commands  [Try Now](#Custom-Commands)
        - right / left
        - "position": "right",  --> NEW ✅ ✅ <br><br> 
        

    - Start the Command to new Terminal <br>
        - `"SimplerFlutterTasks.createNewTerminal": true,`

### 2.8.2
  - Fixed Open Apk Folder
    - Mac ✅
    - Linux ✅
    - Windows ✅

### 0.2.6
  - Fixed Custom Commands
  - The Command `flutter clean` now work with `flutter pub get`
### 0.2.5
  - Added feature
    - hide / show icon
      - Flutter Clean
      - Flutter Pub get

### 0.2.3-4
  - Custom Commands auto updating, now you don't have to reload the VisualStudio Code

### 0.2.2
  - Новая Фича [new feature]
  - Custom Commands
    - Create your own commands

### 0.2.1
  - New Commands
    - Small Apk:
    - Spider Build:
    - Easy Localizations
      - default value 
        - dart run easy_localization:generate -S assets/langs -O lib/langs
        - dart run easy_localization:generate -S assets/langs -f keys -o locale_keys.g.dart 
        
  - Added Hide / Show Icon
    - flutter clean:
    - flutter pub get:
    - flutter build apk:
    - flutter build ios:
    - flutter build ipa:
    - flutter install:
    - Build runner:
    - Open Apk Folder:
    - Small Apk:
    - Spider Build:
    - Easy Localizations:
  
  - Change Visibility icons in Extension's Settings |Simpler Flutter Tasks|

### 0.2.0

  - Git pull
    - Just Git Pulling
    - adding Beta testing hide or show icon " git pull icon by default is hide "
    - open settings vs code -> search simpler flutter tasks -> there the set hide or show git pull icon
   
### 0.1.9

- Optimized
  - starting commands

### 0.1.8

- Flutter Install
  - installing

### 0.1.6-7

- Fixed bugs with terminal

### 0.1.5

- Build runner:
  - dart run build_runner build --delete-conflicting-outputs
- Open Apk Folder:
  - opening apk folder, if not exists "app-release.apk" -> open |build/outputs|
    - Mac ✅
    - Linux ❌
    - Windows ❌

### 0.1.0

- flutter clean:
  - just cleaning project.
- flutter pub get:
  - get all dependencies 
- flutter build apk:
  - Build for android
- flutter build ios:
  - Build for ios
- flutter build ipa:
  - Build for ipa


### 0.0.1

Initial release


## Requirements

Vscode: ^1.82.0

## Reference

[Simpler Flutter Snippet](https://marketplace.visualstudio.com/items?itemName=Eldiyar-Dev.simpler-flutter-snippets)
[Simpler Flutter Generator](https://marketplace.visualstudio.com/items?itemName=Eldiyar-Dev.simpler-flutter-generator)

Enjoy !!!! 😉 
