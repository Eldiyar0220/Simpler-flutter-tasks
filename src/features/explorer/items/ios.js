const vscode = require('vscode');
const { inProjectDir } = require('../../../utils/workspace');
const { icon, command, header, openBuild, categoryState } = require('./helpers');

function iosItems(context, forceExpanded = false) {
    return {
        label: 'iOS',
        iconPath: icon(context, 'ios_assets.svg'),
        collapsibleState: categoryState('iosCategoryExpandable', forceExpanded),
        children: [
            command('1) Build Ios', 'flutter build ios'),
            command('2) Build Ipa', 'flutter build ipa'),
            command('3) Pod Install', inProjectDir('ios', 'pod install')),
            command('4) Pod update', inProjectDir('ios', 'pod update')),
            command('5) Pod Repo Update', 'pod repo update'),
            command('6) Pod cache clean --all ❌', inProjectDir('ios', 'pod cache clean --all')),
            command('7) Pod setup', 'pod setup'),
            command('8) Pod Init', inProjectDir('ios', 'pod init')),
            command('9) Flutter create -i swift .', 'flutter create -i swift .'),
            command('10) Pod --version', 'pod --version'),
            {
                label: 'Deleting',
                collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
                children: [
                    command('1) Delete .symlinks ', inProjectDir('ios', 'rm -Rf .symlinks')),
                    command('2) Delete Pods ', inProjectDir('ios', 'rm -Rf Pods')),
                    command('3) Delete Podfile.lock', inProjectDir('ios', 'rm -Rf Podfile.lock')),
                    command('4) Pod deintegrate', inProjectDir('ios', 'pod deintegrate')),
                ],
            },
            {
                label: 'CocoPods',
                collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
                children: [
                    command('sudo gem install cocoapods', 'sudo gem install cocoapods'),
                    command('brew install cocoapods', 'brew install cocoapods'),
                    command('brew upgrade cocoapods', 'brew upgrade cocoapods'),
                    command('brew link --overwrite cocoapods', 'brew link --overwrite cocoapods'),
                ],
            },
            header(' ----------------Open Build----------------- '),
            openBuild('ios', 'IPA / .app'),
        ],
    };
}

module.exports = {
    iosItems,
};
