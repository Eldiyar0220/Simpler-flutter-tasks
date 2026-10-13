const vscode = require('vscode');
const crypto = require('crypto');
const { EXTENSION_ID } = require('../constants');
const { OPEN_COMMAND } = require('./settings_panel/settings_panel');

const LAST_VERSION_KEY = `${EXTENSION_ID}:last-version`;
const PENDING_FOCUS_KEY = `${EXTENSION_ID}:pending-focus`;
const VIEW_TYPE = 'simplerFlutterTasks.welcome';

const WHATS_NEW = [
    {
        en: 'Settings Panel — all toggles, status bar icons and custom commands on one page.',
        ru: 'Панель настроек — все тумблеры, иконки status bar и команды на одной странице.',
    },
    {
        en: 'GIT Helps — New Branch, Commit, Rebase and Push in one status bar menu.',
        ru: 'GIT Helps — New Branch, Commit, Rebase и Push в одном меню.',
    },
    {
        en: 'Categories for custom commands — several commands share one button. Hover it to pick a command right there.',
        ru: 'Категории custom commands — несколько команд в одной кнопке. Наведи на неё и выбери команду прямо в подсказке.',
    },
    {
        en: 'Fill a category with your commands or Status Bar Icons — an icon added there runs exactly like its button.',
        ru: 'Категорию можно заполнить своими командами или Status Bar Icons — такая команда запускается как сама кнопка.',
    },
    {
        en: 'Drag & drop to reorder commands and move them between categories.',
        ru: 'Drag & drop — меняй порядок команд и переноси их между категориями.',
    },
    {
        en: 'History — removed commands and deleted categories go there; restore or clear all in one click.',
        ru: 'История — туда попадают убранные команды и команды удалённых категорий; можно вернуть или очистить всё.',
    },
    {
        en: 'Flutter Flavor is editable in the panel: flavors, packages and menu commands.',
        ru: 'Flutter Flavor редактируется в панели: flavors, пакеты и команды меню.',
    },
];

function currentVersion() {
    const extension = vscode.extensions.getExtension(EXTENSION_ID);
    return extension ? extension.packageJSON.version : '0.0.0';
}

function registerWelcome(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand('flutter-tasks.showWelcome', async () => {
            const version = currentVersion();
            const picked = await vscode.window.showQuickPick([
                { label: 'Preview: первая установка', description: 'Welcome, then settings', id: 'preview-new' },
                { label: 'Preview: обновление с 3.1.5', description: 'Welcome + What’s New, then settings', id: 'preview-update' },
                { label: 'Следующий запуск: как первая установка', description: 'Стереть last-version → Reload Window', id: 'reset-new' },
                { label: 'Следующий запуск: как обновление', description: 'Записать last-version = 3.1.5 → Reload Window', id: 'reset-update' },
            ], { placeHolder: 'Test Welcome / What’s New' });
            if (!picked) {
                return;
            }
            if (picked.id === 'preview-new') {
                showWelcomePage(context, version, undefined);
                return;
            }
            if (picked.id === 'preview-update') {
                showWelcomePage(context, version, '3.1.5');
                return;
            }
            await context.globalState.update(LAST_VERSION_KEY, picked.id === 'reset-update' ? '3.1.5' : undefined);
            const reload = await vscode.window.showInformationMessage(
                picked.id === 'reset-update'
                    ? 'next launch = update 3.1.5 → ' + version
                    : 'next launch = first install',
                'Reload Window',
            );
            if (reload) {
                await vscode.commands.executeCommand('workbench.action.reloadWindow');
            }
        }),
    );
}

/** Shows a welcome / "what's new" page once per version, then opens the settings panel. */
async function showWelcomeOrWhatsNew(context) {
    const previousVersion = context.globalState.get(LAST_VERSION_KEY);
    const version = currentVersion();
    if (version === '0.0.0') {
        return;
    }
    if (previousVersion === version) {
        return;
    }

    const show = () => {
        void context.globalState.update(PENDING_FOCUS_KEY, undefined);
        void context.globalState.update(LAST_VERSION_KEY, version);
        showWelcomePage(context, version, previousVersion);
    };

    if (vscode.window.state.focused) {
        show();
        return;
    }

    await context.globalState.update(PENDING_FOCUS_KEY, true);
    const disposable = vscode.window.onDidChangeWindowState(event => {
        if (!event.focused) {
            return;
        }
        disposable.dispose();
        if (context.globalState.get(PENDING_FOCUS_KEY) === true) {
            show();
        }
    });
    context.subscriptions.push(disposable);
}

function showWelcomePage(context, version, previousVersion) {
    const isUpdate = Boolean(previousVersion);
    const imagesRoot = vscode.Uri.joinPath(context.extensionUri, 'images');
    const iconsRoot = vscode.Uri.joinPath(context.extensionUri, 'assets', 'icons');
    const panel = vscode.window.createWebviewPanel(
        VIEW_TYPE,
        isUpdate ? 'What’s New' : 'Welcome',
        vscode.ViewColumn.Active,
        {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [imagesRoot, iconsRoot],
        },
    );
    panel.iconPath = vscode.Uri.joinPath(context.extensionUri, 'assets', 'icons', 'main_settings_icon.gif');
    panel.webview.html = renderWelcomeHtml(panel.webview, imagesRoot, iconsRoot, version, previousVersion);

    let openedSettings = false;
    const openSettings = () => {
        if (openedSettings) {
            return;
        }
        openedSettings = true;
        vscode.commands.executeCommand(OPEN_COMMAND);
    };

    const disposables = [
        panel.webview.onDidReceiveMessage(message => {
            if (message.type === 'openView') {
                vscode.commands.executeCommand('workbench.view.extension.flutter-commands-container');
            }
            if (message.type === 'continue') {
                panel.dispose();
            }
        }),
    ];
    panel.onDidDispose(() => {
        disposables.forEach(disposable => disposable.dispose());
        openSettings();
    });
}

function renderWelcomeHtml(webview, imagesRoot, iconsRoot, version, previousVersion) {
    const nonce = crypto.randomBytes(16).toString('base64');
    const logo = webview.asWebviewUri(vscode.Uri.joinPath(imagesRoot, 'eldiyar_profile_icon.png'));
    const apple = webview.asWebviewUri(vscode.Uri.joinPath(iconsRoot, 'ios_assets.svg'));
    const isUpdate = Boolean(previousVersion);
    const news = isUpdate
        ? `<section class="news">
            <h2>Что нового · What’s New</h2>
            <p class="news__from">v${escapeHtml(previousVersion)} → v${escapeHtml(version)}</p>
            <ul>${WHATS_NEW.map(item => `<li><span class="en">${escapeHtml(item.en)}</span><span class="ru">${escapeHtml(item.ru)}</span></li>`).join('')}</ul>
        </section>`
        : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome</title>
    <style>
        :root {
            --flutter-dark: #02569b;
            --flutter-light: #13b9fd;
            --card: var(--vscode-editorWidget-background, rgba(127, 127, 127, 0.08));
            --border: var(--vscode-widget-border, rgba(127, 127, 127, 0.22));
            --muted: var(--vscode-descriptionForeground, rgba(127, 127, 127, 0.9));
        }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            color: var(--vscode-foreground);
            background: var(--vscode-editor-background);
            font-family: var(--vscode-font-family);
            font-size: 13px;
            line-height: 1.5;
        }
        .hero {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 28px 32px;
            color: #fff;
            background: linear-gradient(120deg, var(--flutter-dark), var(--flutter-light));
        }
        .hero img {
            width: 52px;
            height: 52px;
            border-radius: 14px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
        }
        .hero {
            position: sticky;
            top: 0;
            z-index: 1;
            flex-wrap: wrap;
        }
        .hero__text { flex: 1; min-width: 180px; }
        .hero .hero__go {
            color: var(--flutter-dark);
            background: #fff;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
        }
        .hero .hero__go:hover { background: #e8f6ff; }
        .hero h1 { margin: 0; font-size: 22px; }
        .hero p { margin: 4px 0 0; opacity: 0.9; }
        .body { max-width: 640px; margin: 0 auto; padding: 28px 32px 40px; }
        .hello {
            padding: 18px 20px;
            border: 1px solid var(--border);
            border-radius: 12px;
            background: var(--card);
        }
        .hello .en { margin: 0 0 6px; font-size: 15px; font-weight: 600; }
        .hello .ru { margin: 0; color: var(--muted); }
        .hint {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-top: 16px;
            padding: 16px 18px;
            border: 1px solid var(--border);
            border-radius: 12px;
            background: var(--card);
        }
        .hint__bar {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            padding: 10px 8px;
            border-radius: 10px;
            background: #1e1e1e;
            box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);
        }
        .hint__dot { width: 14px; height: 14px; border-radius: 4px; background: #555; opacity: 0.55; }
        .hint__icon {
            width: 28px;
            height: 28px;
            padding: 4px;
            border-radius: 8px;
            background: color-mix(in srgb, var(--flutter-light) 28%, transparent);
        }
        .hint__icon img { display: block; width: 100%; height: 100%; }
        .hint .en { margin: 0 0 6px; font-weight: 600; }
        .hint .ru { margin: 0; color: var(--muted); }
        .hint button {
            margin-top: 10px;
            padding: 6px 12px;
            font-size: 12px;
        }
        .news { margin-top: 22px; }
        .news h2 { margin: 0 0 4px; font-size: 16px; }
        .news__from { margin: 0 0 12px; color: var(--muted); font-size: 12px; }
        .news ul { margin: 0; padding: 0; list-style: none; }
        .news li {
            margin: 0 0 10px;
            padding: 12px 14px;
            border: 1px solid var(--border);
            border-radius: 10px;
            background: var(--card);
        }
        .news .en { display: block; font-weight: 600; }
        .news .ru { display: block; margin-top: 4px; color: var(--muted); }
        .actions {
            position: sticky;
            bottom: 0;
            margin: 24px -32px 0;
            padding: 14px 32px;
            background: linear-gradient(to top, var(--vscode-editor-background) 75%, transparent);
        }
        .body { padding-bottom: 0; }
        button {
            font: inherit;
            padding: 9px 18px;
            border: 0;
            border-radius: 8px;
            color: #fff;
            background: var(--flutter-dark);
            cursor: pointer;
            font-weight: 600;
        }
        button:hover { background: #0277bd; }
    </style>
</head>
<body>
    <header class="hero">
        <img src="${logo}" alt="">
        <div class="hero__text">
            <h1>Добро пожаловать</h1>
            <p>Welcome to Simpler Flutter Tasks v${escapeHtml(version)}</p>
        </div>
        <button type="button" id="go" class="hero__go">${isUpdate ? 'Открыть настройки · Open Settings' : 'Начать · Open Settings'} →</button>
    </header>
    <main class="body">
        <div class="hello">
            <p class="en">${isUpdate ? 'Thanks for updating. Here’s what changed, then the settings panel opens.' : 'Thanks for installing. Next you’ll see the settings panel — all commands in one place.'}</p>
            <p class="ru">${isUpdate ? 'Спасибо за обновление. Сначала что нового, потом откроется панель настроек.' : 'Спасибо за установку. Дальше откроется панель настроек — все команды в одном месте.'}</p>
        </div>
        <div class="hint">
            <div class="hint__bar" aria-hidden="true">
                <span class="hint__dot"></span>
                <span class="hint__dot"></span>
                <span class="hint__icon"><img src="${apple}" alt=""></span>
                <span class="hint__dot"></span>
            </div>
            <div>
                <p class="en">Left activity bar — the Apple icon (the old one for now). Click it anytime to open Commands.</p>
                <p class="ru">Слева на панели — иконка-яблоко (пока старая). Нажми её — откроется Commands.</p>
                <button type="button" id="openView">Показать Commands · Show sidebar</button>
            </div>
        </div>
        ${news}
        <div class="actions">
            <button type="button" class="go">${isUpdate ? 'Открыть настройки · Open Settings' : 'Начать · Open Settings'}</button>
        </div>
    </main>
    <script nonce="${nonce}">
        const vscode = acquireVsCodeApi();
        document.querySelectorAll('#go, .go').forEach(button =>
            button.addEventListener('click', () => vscode.postMessage({ type: 'continue' })));
        document.getElementById('openView').addEventListener('click', () => vscode.postMessage({ type: 'openView' }));
    </script>
</body>
</html>`;
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

module.exports = {
    registerWelcome,
    showWelcomeOrWhatsNew,
};
