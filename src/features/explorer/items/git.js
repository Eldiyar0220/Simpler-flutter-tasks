const { icon, copyOnly, header, categoryState } = require('./helpers');

function gitItems(context) {
    return {
        label: 'Git Hub',
        iconPath: icon(context, 'github_assets.svg'),
        collapsibleState: categoryState('gitCategoryExpandable'),
        children: [
            {
                label: 'Init Repository',
                iconPath: icon(context, 'git_init.gif'),
                children: [
                    copyOnly('1) git init', 'git init'),
                    copyOnly('2) git add .', 'git add .'),
                    copyOnly('3) git commit -m "first commit"', "git commit -m 'first commit'"),
                    copyOnly('4) git branch -M main', 'git branch -M main'),
                    copyOnly('5) git remote add origin  YOUR_GIT_URL', 'git remote add origin  YOUR_GIT_URL'),
                    copyOnly('6) git push -u origin main', 'git push -u origin main'),
                    header(' ----------------Git Repo----------------- '),
                    copyOnly('1) git branch -m NEW_NAME', 'git branch -m NEW_NAME', { description: "Change The Branch's name" }),
                    copyOnly('2) git branch', 'git branch'),
                    copyOnly('3) git checkout -b YOUR_NEW_BRANCH', 'git checkout -b NEW_BRANCH', { description: 'Create The Branch and switch' }),
                    copyOnly('4) git push --set-upstream origin YOUR_BRANCH', 'git push --set-upstream origin yourBranch'),
                    copyOnly('5) git push -f origin YOUR_BRANCH', 'git push -f origin YOUR_BRANCH'),
                ],
            },
            {
                label: 'Git Cancelers',
                iconPath: icon(context, 'thunder.gif'),
                children: [
                    copyOnly('1) git reset --soft HEAD~', 'git reset --soft HEAD~', { description: 'Cancel last Commit' }),
                    copyOnly('2) git rebase --abort', 'git rebase --abort', { description: 'Cancel last rebase' }),
                    copyOnly('3) git merge --abort', 'git merge --abort', { description: 'Cancel last Merge' }),
                ],
            },
            {
                label: 'Git Repo',
                iconPath: icon(context, 'git_repo.gif'),
                children: [
                    copyOnly('1) git pull --rebase origin YOUR_MAIN_BRANCH', 'git pull --rebase origin YOUR_MAIN_BRANCH'),
                    copyOnly('2) git merge YOUR_BRANCH', 'git merge YOUR_MAIN_BRANCH'),
                    copyOnly('3) git config --global http.postBuffer 157286400', 'git config --global http.postBuffer 157286400'),
                ],
            },
        ],
    };
}

module.exports = {
    gitItems,
};
