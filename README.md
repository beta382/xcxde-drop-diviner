# [Xenoblade X: Definitive Edition - Drop Diviner](https://beta382.github.io/xcxde-drop-diviner/)

A GitHub Pages static website adaptation of Hamidu's _Xenoblade X Weapon Wizard_, a tool for _Xenoblade Chronicles X: Definitive Edition_ which facilitates RNG manipulation of enemy loot drops.

_Drop Diviner_ helps you find your current Seed, track your RNG State, and search for RNG States where a target enemy will drop desired loot.

See the [guide](https://docs.google.com/document/d/1LSj02XSdihvrqijTrckVvidrTGUe163ufec1_EYR6C0) for more details.

## Development

### Technologies Used

- [TypeScript](https://www.typescriptlang.org/)
- [Rust](https://doc.rust-lang.org/book/)
- [npm](https://nodejs.org/en)
- [Vite](https://vite.dev/)
- [React](https://react.dev/)
- [Material UI](https://mui.com/material-ui/getting-started/)
- [i18next](https://www.i18next.com/)
- [wasm-pack](https://wasm-bindgen.github.io/wasm-pack/book/)

### Getting Started

1. Download and install a relatively recent version of [Node.js](https://nodejs.org/en/download) with npm
2. Download and install [rustup](https://rustup.rs/)
3. Run `npm install`
4. Run `npm run dev`

You should have the site running locally at `localhost:5173`.

### Environment Recommendations

[VS Code](https://code.visualstudio.com/) is the recommended editor.

#### Plugins

- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

#### Settings

```json
...
"editor.codeActionsOnSave": [
  "source.removeUnusedImports",
  "source.addMissingImports.ts",
  "source.sortImports",
  "source.fixAll.ts",
  "source.fixAll.eslint",
  "source.fixAll.prettier",
],
"editor.defaultFormatter": "esbenp.prettier-vscode",
"editor.formatOnSave": true,
"js/ts.preferences.autoImportSpecifierExcludeRegexes": ["^@mui/[^/]+$"],
"js/ts.preferences.importModuleSpecifier": "non-relative",
"[html]": {
  "editor.defaultFormatter": "vscode.html-language-features",
},
"[rust]": {
  "editor.defaultFormatter": "rust-lang.rust-analyzer",
  "editor.formatOnSave": true,
  "editor.inlayHints.enabled": "off",
},
...
```

## Contributing a UI Translation

UI translation files are located [here](public/locales/), with [English](/public/locales/en) serving as the reference language. The only languages supported are ones with game data translations; there are no plans to support other languages. Additionally, voice lines (the `vas` translation key) are only supported for English and 日本語 (Japanese).

- [English](/public/locales/en)
- [Deutsch (German)](/public/locales/de)
- [español (Spanish)](/public/locales/es)
- [français (French)](/public/locales/fr)
- [italiano (Italian)](/public/locales/it)
- [日本語 (Japanese)](/public/locales/ja)
- [한국어 (Korean)](/public/locales/ko)
- [中文（简体）(Chinese - Simplified)](/public/locales/zh-CN)
- [中文（繁體）(Chinese - Traditional)](/public/locales/zh-TW)

To add a translation

1. Fork the repository
2. Update the translation file for your target language
3. Update `uiTranslated` to `true` for your target language in [languages.ts](src/common/languages.ts) (this changes the icon next to the language in the UI to a green checkmark)
4. Update the `"Loading Data..."` string in [index.html](index.html) for your target language (this displays before i18next loads, so it has to be handled separately)
5. Submit a Pull Request.

The [i18next](https://www.i18next.com/) documentation may prove helpful, though it largely targets the development aspect.

The English reference translation is organized roughly by visual order (top to bottom) on the website.

The following translation keys may be less obvious:

- `common.listJoin`: Used to join items of a list, such as Voice Lines. Note that the English reference translation does **NOT** include a space (see `common.shouldSpaceJoinedList` below).
- `common.shouldSpaceJoinedList`: Must be a boolean (`true` or `false`), not a string. If this is `true`, then a gap equal to a typical space character `" "` will be inserted between list items (visually after the `common.listJoin` character). If this is `false`, then no gap will be inserted. This exists so that spacing is not inserted when wraparound occurs (since the CSS `white-space` property cannot be used, as each list item is their own element), and so that languages whose `common.listJoin` character already includes spacing (e.g. `"、"`)can opt out of having additional space added.
