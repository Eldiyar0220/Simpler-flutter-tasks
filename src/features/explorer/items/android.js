const vscode = require('vscode');
const { inProjectDir } = require('../../../utils/workspace');
const { icon, command, header, openBuild, categoryState } = require('./helpers');

function androidItems(context, forceExpanded = false) {
    return {
        label: 'Android',
        iconPath: icon(context, 'android_assets.svg'),
        collapsibleState: categoryState('androidCategoryExpandable', forceExpanded),
        children: [
            command('1) Build APK', 'flutter build apk'),
            command('2) Build App Bundle', 'flutter build appbundle', { description: '- Release -' }),
            command('3) Build Small apk', 'flutter build apk --split-per-abi'),
            {
                label: 'GRADLE',
                iconPath: icon(context, 'gradle_white.svg'),
                collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
                children: [
                    command('1) Gradle Dependencies', inProjectDir('android', './gradlew app:dependencies')),
                    command('2) Gradle SigningReport', inProjectDir('android', './gradlew signingReport')),
                    command('2) Gradle build', inProjectDir('android', './gradlew build')),
                    command('6) Gradle Clean ❌', inProjectDir('android', './gradlew clean')),
                ],
            },
            header(' ----------------Open Build----------------- '),
            openBuild('android', 'APK / AAB, any flavor'),
        ],
    };
}

module.exports = {
    androidItems,
};
