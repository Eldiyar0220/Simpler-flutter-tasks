const { icon, command, copyOnly, categoryState } = require('./helpers');

function buildRunnerItems(context) {
    return {
        label: 'Build Runner',
        iconPath: icon(context, 'build_runner_new.svg'),
        collapsibleState: categoryState('buildRunnerCategoryExpandable'),
        children: [
            command('1) Build runner build', 'dart run build_runner build'),
            command('2) Build Runner with Delete Outputs', 'dart run build_runner build --delete-conflicting-outputs'),
            command('3) Build Runner with Delete Outputs - V', 'dart run build_runner build --delete-conflicting-outputs -v'),
            copyOnly('4) Build Runner With Filter', "dart run build_runner build --delete-conflicting-outputs --build-filter 'path/*.dart'"),
        ],
    };
}

module.exports = {
    buildRunnerItems,
};
