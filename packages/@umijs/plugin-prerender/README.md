# @umijs/plugin-prerender

[![NPM version](https://img.shields.io/npm/v/@umijs/plugin-prerender.svg?style=flat)](https://npmjs.org/package/@umijs/plugin-prerender) [![NPM downloads](http://img.shields.io/npm/dm/@umijs/plugin-prerender.svg?style=flat)](https://npmjs.org/package/@umijs/plugin-prerender)

A plugin for pre render

## Usage

Configure in `.umirc.js`,

```js
export default {
  plugins: [['@umijs/plugin-prerender', options]],
};
```

## Options

```typescript
export interface IOpts {
  exclude?: string[];
  /** disable ssr BOM polyfill */
  disablePolyfill?: boolean;
  // you mock global, { g_lang: 'zh-CN' } => global.window.g_lang / global.g_lang
  runInMockContext?: object | IContextFunc;
  // use renderToStaticMarkup
  staticMarkup?: boolean;
  // htmlSuffix
  htmlSuffix?: boolean;
}
```

- exclude: exclude routes not pre render
- disablePolyfill: disable `ssr-polyfill` for client window object
- runInMockContext: you mock global
- staticMarkup: use `renderToStaticMarkup`, default use `renderToString`
- htmlSuffix: route Enable the `.html` suffix.

## TODO
- [x] support dynamicImport for chunkMap assets, render chunk styles and prefetch scripts.
- [x] friendly log shows like `▶  start`, `☒  complete`, `✔  success`
- [x] runInMockContext for users can custom your global variables.
- [x] use `jsdom` for mock Bom in Node env.
- [ ] dynamic route prerender
- [ ] support `react-document-title`, `react-helmet` to dynamic title.
- [ ] more test cases, add coverage badge
- [ ] register command `umi render-preview` to run a static server for prerendered site.

## LICENSE

MIT
