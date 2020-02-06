import { IApi } from 'umi';
import { join } from 'path';
import { readFileSync } from 'fs';
import {
  getLocaleList,
  isNeedPolyfill,
  exactLocalePaths,
  getMomentLocale,
} from './utils';

interface IOpts {
  default?: string;
  baseNavigator?: boolean;
  antd?: boolean;
  baseSeparator?: string;
}

type ILocaleOpts = IOpts;

export default (api: IApi, opts: ILocaleOpts = {}) => {
  const {
    paths,
    utils: { Mustache, lodash, winPath },
    config = {},
  } = api;

  api.describe({
    key: 'locale',
    config: {
      schema(joi) {
        return joi.object();
      },
    },
  });

  const localeFolder = config?.singular ? 'locale' : 'locales';
  const { baseSeparator = '-' } = opts;
  const defaultLocale = opts.default || `zh${baseSeparator}CN`;
  const [lang, country] = defaultLocale?.split(baseSeparator) || [];

  const localeList = getLocaleList({
    localeFolder,
    separator: baseSeparator,
    absSrcPath: paths.absSrcPath,
    absPagesPath: paths.absPagesPath,
  });

  // 生成临时文件
  api.onGenerateFiles(() => {
    const localeTpl = readFileSync(join(__dirname, 'locale.tpl'), 'utf-8');

    api.writeTmpFile({
      content: Mustache.render(localeTpl, {
        BaseSeparator: baseSeparator,
        DefaultLocale: defaultLocale,
        DefaultLang: defaultLocale,
        DefaultMomentLocale: getMomentLocale(lang, country),
      }),
      path: 'plugin-locale/locale.tsx',
    });

    const localeExportsTpl = readFileSync(
      join(__dirname, 'localeExports.tpl'),
      'utf-8',
    );
    api.writeTmpFile({
      path: 'plugin-locale/localeExports.ts',
      content: Mustache.render(localeExportsTpl, {
        BaseSeparator: baseSeparator,
        LocaleList: localeList,
        warningPkgPath: winPath(require.resolve('warning')),
        reactIntlPkgPath: winPath(require.resolve('react-intl/lib/index.js')),
      }),
    });
    // runtime.tsx
    const runtimeTpl = readFileSync(join(__dirname, 'runtime.tpl'), 'utf-8');
    api.writeTmpFile({
      path: 'plugin-locale/runtime.tsx',
      content: Mustache.render(runtimeTpl, {}),
    });
  });

  api.addRuntimePluginKey(() => 'locale');
  // Runtime Plugin
  api.addRuntimePlugin(() =>
    join(paths.absTmpPath!, 'plugin-locale/runtime.tsx'),
  );

  // Modify entry js
  api.addEntryCodeAhead(() =>
    `require('./plugin-locale/locale')._onCreate();`.trim(),
  );

  // watch locale files
  api.addTmpGenerateWatcherPaths(() => exactLocalePaths(localeList));

  api.addUmiExports(() => {
    return {
      exportAll: true,
      source: `../plugin-locale/localeExports`,
    };
  });
};
