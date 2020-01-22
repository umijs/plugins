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
        LocaleList: localeList,
      }),
      path: 'plugin-locale/locale.tsx',
    });
  });

  // Runtime Plugin
  api.addRuntimePlugin(() => join(__dirname, '../src/runtime.tsx'));

  // Modify entry js
  api.addEntryCodeAhead(() =>
    `require('@@/plugin-locale/locale')._onCreate();`.trim(),
  );

  api.addTmpGenerateWatcherPaths(() => exactLocalePaths(localeList));

  api.addUmiExports(() => {
    return {
      exportAll: true,
      source: `${paths.aliasedTmpPath}/plugin-locale/locale`,
    };
  });
};
