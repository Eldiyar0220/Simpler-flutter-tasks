/**
 * Simpler Flutter Generator card of the settings panel: feature list, demo lessons and the mini guide.
 * Loaded before panel.js, which calls createGeneratorPanel with its shared helpers.
 */
// eslint-disable-next-line no-undef
window.createGeneratorPanel = function createGeneratorPanel({ h, vscode, showLesson, getState }) {
    function renderScene(kind) {
        if (kind === 'genArchitecture') {
            const tree = [
                [0, '📁', 'settings'],
                [1, '📁', 'data'],
                [2, '📄', 'settings_repository_impl.dart'],
                [1, '📁', 'domain'],
                [2, '📄', 'settings_use_case.dart'],
                [1, '📁', 'presentation'],
                [2, '📄', 'settings_page.dart'],
                [2, '📄', 'settings_bloc.dart'],
            ];
            return h('div', { class: 'demo demo-gen' },
                h('div', { class: 'demo-gen__input' },
                    h('div', { class: 'demo-gen__field' },
                        h('span', { class: 'demo-gen__typed' }, 'settings'),
                        h('span', { class: 'demo-edit__caret' })),
                    h('p', { class: 'demo-edit__hint' }, 'Feature name / Имя фичи')),
                h('div', { class: 'demo-gen__tree' }, tree.map(([depth, icon, name], index) => h('div', {
                    class: `demo-gen__row${icon === '📁' ? ' demo-gen__row--folder' : ''}`,
                    style: { paddingLeft: `${6 + depth * 16}px`, animationDelay: `${index * 0.12}s` },
                }, `${icon} ${name}`))));
        }
        if (kind === 'guidePubspec') {
            return h('div', { class: 'demo demo-gen' },
                codeCard('pubspec.yaml', [
                    'flutter:',
                    '  uses-material-design: true',
                    { text: '', step: 0 },
                    { text: '  assets:', tone: 'green', step: 1 },
                    { text: '    - assets/images/', tone: 'green', step: 2 },
                    { text: '    - assets/icons/', tone: 'green', step: 3 },
                ]));
        }
        if (kind === 'guideCreateYaml') {
            return h('div', { class: 'demo demo-ui' },
                explorerMock([
                    { name: '📁 assets', active: true },
                    { name: '📁 lib' },
                    { name: '📄 pubspec.yaml' },
                    { name: '📄 simpler_generator_images.yaml', isNew: true },
                ]),
                h('div', { class: 'demo-ui__popups' },
                    menuMock(['New File…', 'New Folder…', '2) Generate Assets', '3) Generate Architecture'], 2),
                    dialogMock({
                        icon: 'ℹ️',
                        title: 'simpler_generator_images.yaml\ndoes not exist in the project directory.',
                        buttons: ['Create File', 'Cancel'],
                    })));
        }
        if (kind === 'guideConfigure') {
            return h('div', { class: 'demo demo-gen' },
                codeCard('simpler_generator_images.yaml', [
                    { text: 'generateAll: false # default [false]', step: 0 },
                    { text: '', step: 1 },
                    { text: 'groups:', step: 2 },
                    { text: '  - path: assets/images', tone: 'yellow', step: 3 },
                    { text: '    class_name: AppImages', tone: 'blue', step: 4 },
                    { text: '    types: [.png, .jpg, .svg, .riv, .json]', step: 5 },
                    { text: '    outputPath: lib/core/constant', tone: 'green', step: 6 },
                    { text: '    warnings: true', step: 7 },
                ]));
        }
        if (kind === 'guidePaths') {
            const result = (text, step) => h('div', {
                class: 'demo-gen__result',
                style: { animationDelay: `${step * 0.15}s` },
            }, text);
            return h('div', { class: 'demo demo-gen' },
                codeCard('Single path — one folder / Один путь', [
                    { text: '  - path: assets/svg', tone: 'yellow', step: 0 },
                    { text: '    class_name: AppSvg', step: 1 },
                    { text: '    types: [ .svg ]', step: 2 },
                    { text: '    outputPath: lib/app/constants', step: 3 },
                    { text: '    warnings: true', step: 4 },
                ]),
                result('→ lib/app/constants/app_svg.dart · class AppSvg', 2),
                codeCard('Multiple path — several folders / Несколько путей', [
                    { text: '  - path:', step: 5 },
                    { text: '      - assets/images', tone: 'yellow', step: 6 },
                    { text: '      - assets/images/new_images', tone: 'blue', step: 7 },
                    { text: '      - assets/images/only_icons', tone: 'green', step: 8 },
                    { text: '    class_name: AppImages', step: 9 },
                    { text: '    types: [.png, .jpg, .jpeg, .webp, .webm, .bmp, .svg, .gif, .riv, .json]', step: 10 },
                    { text: '    outputPath: lib/core/constant', step: 11 },
                    { text: '    warnings: true', step: 12 },
                ]),
                result('→ lib/core/constant/app_images.dart · class AppImages (3 folders → 1 class)', 8));
        }
        if (kind === 'guideGroups') {
            const group = (path, className, tone, types, extra = []) => [
                `  - path: ${path}`,
                { text: `    class_name: ${className}`, tone, late: ' ← button' },
                `    types: ${types}`,
                '    outputPath: lib/app/constants',
                '    warnings: true',
                ...extra,
            ];
            return h('div', { class: 'demo demo-ui' },
                h('div', { class: 'demo-ui__main' },
                    codeCard('simpler_generator_images.yaml', [
                        { text: 'generateAll: false # default [false]', tone: 'red' },
                        '',
                        'groups:',
                        ...group('assets/images', 'AppImages', 'yellow', '[.png, .jpg, .jpeg, .webp, .webm, .bmp, .svg, .gif, .riv, .json]', [
                            '',
                            '    # Warning do not put to true both, it will take very long analyze your project!!',
                            '    # checkUnusedVariables: false',
                            '    # checkUnusedAssets: false',
                        ]),
                        '',
                        ...group('assets/svg', 'AppSvg', 'blue', '[ .svg ]'),
                        '',
                        ...group('assets/rive', 'AppRive', 'green', '[ .riv ]'),
                    ])),
                h('div', { class: 'demo-ui__popups' }, chooseGroupDialog('demo-dialog--late')));
        }
        if (kind === 'guideGenerate') {
            return h('div', { class: 'demo demo-ui' },
                explorerMock([
                    { name: '📁 assets', active: true },
                    { name: '📁 lib' },
                    { name: '📁 core/constant', depth: 1 },
                    { name: '📄 app_images.dart', depth: 2, isNew: true },
                ]),
                h('div', { class: 'demo-ui__popups' },
                    menuMock(['New File…', 'New Folder…', '2) Generate Assets', '3) Generate Architecture'], 2),
                    chooseGroupDialog()));
        }
        if (kind === 'guideUse') {
            return h('div', { class: 'demo demo-gen' },
                codeCard('lib/home_page.dart', [
                    'Column(',
                    '  children: [',
                    { text: '    Image.asset(AppImages.logo),', tone: 'yellow', step: 0 },
                    { text: '    SvgPicture.asset(AppSvg.avatar),', tone: 'blue', step: 1 },
                    { text: '    RiveAnimation.asset(AppRive.splash),', tone: 'green', step: 2 },
                    '  ],',
                    '),',
                ]));
        }
        if (kind === 'genAssets') {
            const files = ['logo.png', 'avatar.svg', 'splash.riv', 'loader.json'];
            return h('div', { class: 'demo demo-gen' },
                h('div', { class: 'demo-gen__source' },
                    h('div', { class: 'demo-gen__tree' },
                        h('div', { class: 'demo-gen__row demo-gen__row--folder demo-gen__row--static' }, '📁 assets/images'),
                        files.map(file => h('div', { class: 'demo-gen__row demo-gen__row--static', style: { paddingLeft: '22px' } }, `🖼 ${file}`))),
                    h('span', { class: 'demo-gen__run' }, '▶ Generate Assets')),
                codeCard('lib/core/constant/app_images.dart', [
                    { text: 'class AppImages {', step: 0 },
                    { text: '  AppImages._();', step: 1 },
                    { text: '', step: 2 },
                    ...files.map((file, index) => ({
                        text: `  static const String ${file.split('.')[0]} = 'assets/images/${file}';`,
                        step: index + 3,
                    })),
                    { text: '}', step: files.length + 3 },
                ]));
        }
        if (kind === 'genAssetsMultiple') {
            return h('div', { class: 'demo demo-gen' },
                codeCard('simpler_generator_images.yaml', [
                    'groups:',
                    '  - path:',
                    { text: '      - assets/images', tone: 'yellow' },
                    { text: '      - assets/images/new_images', tone: 'blue' },
                    { text: '      - assets/images/only_icons', tone: 'green' },
                    '    class_name: AppImages',
                    '    types: [.png, .jpg, .jpeg, .svg, .riv, .json]',
                    { text: '    warnings: true', tone: 'red' },
                ]),
                h('span', { class: 'demo-gen__run' }, '▶ Generate Assets'),
                codeCard('lib/core/constant/app_images.dart', [
                    { text: 'class AppImages {', step: 0 },
                    { text: '  AppImages._();', step: 1 },
                    { text: '', step: 2 },
                    { text: "  static const String images2 = 'assets/images/images2.jpeg';", tone: 'yellow', step: 3 },
                    { text: "  static const String imgSp = 'assets/images/img sp.jpg';", late: ' //!Warning', tone: 'red', step: 4 },
                    { text: '', step: 5 },
                    { text: "  static const String newImages1 = 'assets/images/new_images/new_images1.png';", tone: 'blue', step: 6 },
                    { text: "  static const String onlyIcons1 = 'assets/images/only_icons/only_icons_1.jpeg';", tone: 'green', step: 7 },
                    { text: '}', step: 8 },
                ]));
        }
        if (kind === 'genWarnings') {
            return h('div', { class: 'demo demo-gen' },
                codeCard('File name with a space / Имя файла с пробелом', [
                    'class AppImages {',
                    { text: "  static const String imgSp = 'assets/images/img sp.jpg';", late: ' !<-Empty_Space!, //!Warning -> [img sp.jpg]', tone: 'red', step: 0 },
                    '}',
                ]),
                codeCard('No files of these types / Нет файлов нужных типов', [
                    'class AppImages {',
                    { text: '  Warnings Empty assets!!', tone: 'red', step: 2 },
                    { text: '', step: 3 },
                    { text: '  //Check ->', step: 4 },
                    { text: '  //types: [.png, .jpg, .jpeg, .webp, .webm, .bmp, .svg, .gif, .riv, .json]', step: 5 },
                    '}',
                ]));
        }
        if (kind === 'genUnusedVariables') {
            return h('div', { class: 'demo demo-gen' },
                h('span', { class: 'demo-gen__scan' }, '🔎 AppImages.* in lib/**/*.dart'),
                codeCard('lib/core/constant/app_images.dart', [
                    'class AppImages {',
                    "  static const String logo = 'assets/images/logo.png';",
                    { text: "  static const String banner = 'assets/images/banner.png';", late: ' //check it {banner} is Unused in Project maybe', tone: 'yellow', step: 0 },
                    "  static const String splash = 'assets/images/splash.riv';",
                    { text: "  static const String oldIcon = 'assets/images/old_icon.svg';", late: ' //check it {oldIcon} is Unused in Project maybe', tone: 'yellow', step: 2 },
                    '}',
                ]));
        }
        if (kind === 'genUnusedAssets') {
            return h('div', { class: 'demo demo-gen' },
                h('span', { class: 'demo-gen__scan' }, '🔎 assets/** ↔ lib/**/*.dart'),
                codeCard('lib/core/constant/UNUSED_ASSETS.dart', [
                    { text: '//500Name: old_banner.png, --> Path: assets/images/old_banner.png', tone: 'red', step: 0 },
                    { text: '//500Name: test_icon.svg, --> Path: assets/icons/test_icon.svg', tone: 'red', step: 1 },
                    { text: '', step: 2 },
                    { text: '', step: 3 },
                    { text: 'please delete this file !!!', step: 4 },
                ]));
        }
        return null;
    }

    const CODE_TOKENS = /('[^']*'|\/\/.*$|#.*$|!<-Empty_Space!|\b(?:class|static|const|String|true|false)\b|^\s*-?\s*[A-Za-z_]+:)/;

    function highlightCode(text) {
        return text.split(CODE_TOKENS).filter(Boolean).map(part => {
            let tone;
            if (part.startsWith("'")) {
                tone = 's';
            } else if (part.startsWith('//') || part.startsWith('#')) {
                tone = 'c';
            } else if (part.startsWith('!<-')) {
                tone = 'w';
            } else if (part.endsWith(':')) {
                tone = 'key';
            } else if (/^(?:class|static|const|String|true|false)$/.test(part)) {
                tone = 'k';
            }
            return tone ? h('span', { class: `tok-${tone}` }, part) : part;
        });
    }

    /**
     * Editor-like window. A line is a string or { text, tone, step, late }:
     * `step` makes it appear in turn, `late` is a tail that lights up after the line.
     */
    function codeCard(title, lines) {
        return h('div', { class: 'demo-code' },
            h('div', { class: 'demo-code__bar' },
                h('span', { class: 'demo-code__dots', 'aria-hidden': 'true' }, h('i'), h('i'), h('i')),
                h('span', {}, title)),
            h('div', { class: 'demo-code__body' }, lines.map((line, index) => {
                const item = typeof line === 'string' ? { text: line } : line;
                const animated = item.step !== undefined;
                const delay = animated ? { animationDelay: `${item.step * 0.15}s` } : undefined;
                return h('div', {
                    class: `demo-code__line${item.tone ? ` demo-code__line--${item.tone}` : ''}${animated ? ' demo-code__line--in' : ''}`,
                    style: delay,
                },
                    h('span', { class: 'demo-code__num' }, String(index + 1)),
                    h('span', {}, highlightCode(item.text),
                        item.late && h('span', { class: 'demo-code__late', style: delay }, item.late)));
            })));
    }

    /** Explorer side bar: `active` is the right-clicked folder, `isNew` appears at the end of the scene. */
    function explorerMock(rows) {
        return h('div', { class: 'demo-explorer' },
            h('div', { class: 'demo-tree__title' }, 'EXPLORER'),
            rows.map(row => h('div', {
                class: `demo-explorer__row${row.active ? ' demo-explorer__row--active' : ''}${row.isNew ? ' demo-explorer__row--new' : ''}`,
                style: { paddingLeft: `${6 + (row.depth || 0) * 14}px` },
            }, row.name)));
    }

    function menuMock(items, hotIndex) {
        return h('div', { class: 'demo-menu' }, items.map((item, index) => h('div', {
            class: `demo-menu__item${index === hotIndex ? ' demo-menu__item--hot' : ''}`,
        }, item)));
    }

    /** macOS-style modal; the first button is the one that gets pressed, `tones` colour the matching buttons. */
    function dialogMock({ icon, title, buttons, tones = [], extraClass = '' }) {
        return h('div', { class: `demo-dialog ${extraClass}` },
            h('div', { class: 'demo-dialog__icon', 'aria-hidden': 'true' }, icon),
            h('p', { class: 'demo-dialog__title' }, title),
            h('div', { class: 'demo-dialog__actions' }, buttons.map((label, index) => h('span', {
                class: `demo-dialog__btn${index === 0 ? ' demo-dialog__btn--primary' : ''}`,
            }, tones[index] && h('i', { class: `demo-dialog__dot demo-dialog__dot--${tones[index]}` }), label))));
    }

    /** With generateAll: false the generator offers every class_name from groups. */
    function chooseGroupDialog(extraClass) {
        return dialogMock({
            icon: '⚠️',
            title: 'Simpler Flutter Generator\nChoose to generate',
            buttons: ['AppImages', 'AppSvg', 'AppRive', 'Cancel'],
            tones: ['yellow', 'blue', 'green'],
            extraClass,
        });
    }

    /** Animated scene first; the heavy remote recording loads only on request and replaces the scene. */
    function generatorDemo(demo) {
        const toRecording = '▶ Watch the real recording / Смотреть запись';
        const toScene = '◀ Back to the animation / Назад к анимации';
        const scene = renderScene(demo.scene);
        const stage = h('div', {}, scene);
        let recording;
        const toggle = h('button', {
            class: 'button button--ghost lesson__watch',
            type: 'button',
            onclick: () => {
                const showRecording = stage.firstChild === scene;
                recording = recording || lessonGif(demo.gif, demo.en);
                stage.replaceChildren(showRecording ? recording : scene);
                toggle.textContent = showRecording ? toScene : toRecording;
            },
        }, toRecording);
        return h('div', {}, stage, h('div', { class: 'lesson__buttons' }, toggle, demo.guide && guideButton(demo.guide)));
    }

    function openFeatureLesson(demo) {
        return showLesson(generatorDemo(demo), demo.en, demo.ru, true, generatorOptions(demo));
    }

    function guideButton(guide) {
        return h('button', {
            class: 'button button--ghost lesson__guide-btn',
            type: 'button',
            onclick: event => openGuide(event.currentTarget.closest('.confirm__box'), guide),
        }, '📘 Mini guide / Мини-урок');
    }

    /** Step-by-step page that temporarily replaces the lesson; "Overview" brings the lesson back. */
    function openGuide(box, guide) {
        const overview = [...box.childNodes];
        const overviewScroll = box.scrollTop;
        let index = 0;
        const backToOverview = () => {
            box.replaceChildren(...overview);
            box.scrollTop = overviewScroll;
        };
        const go = next => {
            index = next;
            render();
        };
        const render = () => {
            const step = guide.steps[index];
            const last = index === guide.steps.length - 1;
            box.replaceChildren(h('div', { class: 'guide' },
                h('div', { class: 'guide__top' },
                    h('button', { class: 'button button--ghost guide__back', type: 'button', onclick: backToOverview }, '← Overview / К описанию'),
                    h('span', { class: 'guide__title' }, guide.title),
                    h('span', { class: 'guide__count' }, `${index + 1} / ${guide.steps.length}`)),
                h('div', { class: 'guide__dots' }, guide.steps.map((item, dotIndex) => h('button', {
                    class: `guide__dot${dotIndex === index ? ' guide__dot--active' : ''}${dotIndex < index ? ' guide__dot--done' : ''}`,
                    type: 'button',
                    title: item.title,
                    'aria-label': item.title,
                    onclick: () => go(dotIndex),
                }))),
                h('div', { class: 'guide__step' },
                    h('h3', { class: 'guide__step-title' }, step.title),
                    renderScene(step.scene),
                    h('p', { class: 'confirm__en' }, step.en),
                    h('p', { class: 'confirm__ru' }, step.ru)),
                h('div', { class: 'confirm__actions' },
                    index > 0 && h('button', { class: 'button button--ghost', type: 'button', onclick: () => go(index - 1) }, '◀ Previous / Назад'),
                    h('button', {
                        class: 'button',
                        type: 'button',
                        onclick: () => (last ? box.closeLesson() : go(index + 1)),
                    }, last ? 'Done ✓ / Готово' : 'Next ▶ / Далее'))));
            box.scrollTop = 0;
        };
        render();
    }

    /** Expandable extra settings; a scene is rebuilt on open so its animation starts from the beginning. */
    function generatorOptions(demo) {
        if (!demo.options) {
            return undefined;
        }
        return h('div', { class: 'lesson__options' },
            h('div', { class: 'lesson__options-title' }, 'More options / Ещё настройки'),
            demo.options.map((option, index) => {
                if (option.note) {
                    return h('div', { class: 'lesson__warn' }, `⚠ ${option.note.en}`, h('br'), option.note.ru);
                }
                const body = h('div', { class: 'lesson__option-body' });
                return h('details', {
                    class: 'lesson__option',
                    style: { animationDelay: `${index * 0.6}s` },
                    ontoggle: event => {
                        if (event.target.open) {
                            body.replaceChildren(renderScene(option.scene),
                                h('p', { class: 'confirm__en' }, option.en),
                                h('p', { class: 'confirm__ru' }, option.ru));
                        }
                    },
                }, h('summary', {},
                    h('code', {}, option.title),
                    h('span', { class: 'lesson__option-hint lesson__option-hint--closed' }, '▶ Show demo / Смотреть'),
                    h('span', { class: 'lesson__option-hint lesson__option-hint--open' }, 'Hide / Скрыть')), body);
            }));
    }

    /** A remote GIF with a spinner while it downloads and a message if there is no connection. */
    function lessonGif(src, alt) {
        const media = h('div', { class: 'lesson__media lesson__media--loading' },
            h('span', { class: 'lesson__spin', 'aria-hidden': 'true' }));
        media.append(h('img', {
            class: 'lesson__gif',
            src,
            alt,
            onload: () => media.classList.remove('lesson__media--loading'),
            onerror: () => media.replaceChildren(h('p', { class: 'lesson__error' },
                'Could not load the animation. Check the internet connection. / Не удалось загрузить анимацию, проверьте интернет.')),
        }));
        return media;
    }

    /** Buttons that open screens of the companion Simpler Flutter Generator extension. */
    function renderExtensionLinks(section) {
        const row = (label, hint, button) => h('div', {
            class: 'row',
            'data-search': `${label} ${hint} ${section.title}`.toLowerCase(),
        },
            h('div', { class: 'row__text' },
                h('div', { class: 'row__label' }, label),
                h('div', { class: 'row__hint' }, hint)),
            button);

        const installed = getState().generatorInstalled;
        const notice = !installed && h('div', {
            class: 'ext-notice',
            'data-search': `${section.title} ${section.features.map(feature => feature.text).join(' ')} install установить`.toLowerCase(),
        },
            h('div', { class: 'ext-notice__title' }, 'What it does / Что умеет'),
            h('ul', { class: 'ext-notice__list' }, section.features.map(feature => h('li', {},
                h('span', { class: 'ext-notice__text' }, feature.text),
                feature.demo && h('span', { class: 'ext-notice__actions' },
                    h('button', {
                        class: 'ext-notice__more',
                        type: 'button',
                        onclick: () => openFeatureLesson(feature.demo),
                    }, '▶ Подробнее · More'),
                    feature.demo.guide && h('button', {
                        class: 'ext-notice__more ext-notice__more--guide',
                        type: 'button',
                        onclick: () => openGuide(openFeatureLesson(feature.demo), feature.demo.guide),
                    }, '📘 Мини-урок · Guide'))))),
            h('div', { class: 'ext-notice__footer' },
                h('span', {}, 'To use it, please install the extension. / Чтобы пользоваться, пожалуйста, установите расширение.'),
                h('button', { class: 'button', onclick: () => vscode.postMessage({ type: 'openGeneratorMarketplace' }) }, 'Install ↗')));

        return h('div', { class: 'list' },
            notice,
            section.links.map(link => row(link.label, link.hint,
                h('button', {
                    class: 'button button--ghost',
                    title: installed ? undefined : 'Not installed — opens the Marketplace page / Не установлено — откроется Marketplace',
                    onclick: () => vscode.postMessage({ type: 'openGenerator', page: link.page }),
                }, installed ? 'Open ↗' : 'Install ↗'))));
    }

    return { renderSection: renderExtensionLinks };
};
