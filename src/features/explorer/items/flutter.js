const { CONTEXT, icon, command, copyOnly, categoryState } = require('./helpers');

function flutterItems(context) {
    return {
        label: 'Flutter',
        iconPath: icon(context, 'flutter_assets_white.svg'),
        collapsibleState: categoryState('flutterCategoryExpandable'),
        children: [
            command('1) Flutter Version', 'flutter --version'),
            command('2) Flutter Doctor 🏥', 'flutter doctor', { description: 'more info -> flutter doctor -v', contextValue: CONTEXT.doctor }),
            command('3) Flutter outdated packages🗂️', 'flutter pub outdated'),
            command('4) Flutter upgrade 🛠️', 'flutter upgrade'),
            command('5) Flutter upgrade Force 🛠️', 'flutter upgrade --force'),
            command('6) Flutter pub get 🛠️', 'flutter pub get', { description: 'more info -> flutter pub get --verbose' }),
            command('7) Flutter pub upgrade 🛠️', 'flutter pub upgrade'),
            command('8) Flutter screenshot 📸', 'flutter screenshot', { contextValue: CONTEXT.screenshot }),
            command('8) Flutter Log ---> 🔎⤵️', 'flutter logs'),
            command('9) Connected Devices 📲', 'flutter devices'),
            command('10) Analyze Project 💉', 'flutter analyze'),
            command('11) Dart Fix All Files - 🧰', 'dart fix --apply'),
            command('12) Dart Format All Files - 🧰', 'dart format .'),
            command('13) Clean The Project ❌', 'flutter clean'),
            command('14) Pub cache clean ❌', 'flutter pub cache clean', { description: 'more -> flutter pub cache repair' }),
            command('15) Change Flutter Version', 'flutter downgrade YOUR_FLUTTER_VERSION', { description: 'example: flutter downgrade v3.0.0' }),
            copyOnly('16) Kill The Terminal', 'killall -9 dart'),
            command('17) Flutter HELP', 'flutter --help --verbose'),
        ],
    };
}

module.exports = {
    flutterItems,
};
