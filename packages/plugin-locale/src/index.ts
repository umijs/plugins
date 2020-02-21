import { IApi } from 'umi';
import { join, dirname } from 'path';
import { readFileSync } from 'fs';
import {
  getLocaleList,
  isNeedPolyfill,
  exactLocalePaths,
  getMomentLocale,
} from './utils';

interface ILocaleConfig {
  default?: string;
  baseNavigator?: boolean;
  antd?: boolean;
  baseSeparator?: string;
}

export default (api: IApi) => {
  const {
    paths,
    utils: { Mustache, lodash, winPath },
  } = api;

  if (!api.userConfig.locale) {
    return;
  }

  api.describe({
    key: 'locale',
    config: {
      schema(joi) {
        return joi.object();
      },
    },
  });

  // 生成临时文件
  api.onGenerateFiles(() => {
    const localeTpl = readFileSync(join(__dirname, 'locale.tpl'), 'utf-8');
    const { baseSeparator = '-', baseNavigator = true } = api.config
      .locale as ILocaleConfig;
    const defaultLocale = api.config.locale?.default || `zh${baseSeparator}CN`;
    const [lang, country] = defaultLocale?.split(baseSeparator) || [];

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
    const localeList = getLocaleList({
      localeFolder: api.config?.singular ? 'locale' : 'locales',
      separator: baseSeparator,
      absSrcPath: paths.absSrcPath,
      absPagesPath: paths.absPagesPath,
    });
    api.writeTmpFile({
      path: 'plugin-locale/localeExports.ts',
      content: Mustache.render(localeExportsTpl, {
        BaseSeparator: baseSeparator,
        BaseNavigator: baseNavigator,
        LocaleList: localeList,
        DefaultLocale: JSON.stringify(defaultLocale),
        warningPkgPath: winPath(require.resolve('warning')),
        // react-intl main use `dist/index.js`
        // use dirname let webpack identify main or module
        reactIntlPkgPath: winPath(
          dirname(require.resolve('react-intl/package')),
        ),
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
  api.addTmpGenerateWatcherPaths(() => {
    const { baseSeparator = '-' } = api.config.locale;
    const localeList = getLocaleList({
      localeFolder: api.config?.singular ? 'locale' : 'locales',
      separator: baseSeparator,
      absSrcPath: paths.absSrcPath,
      absPagesPath: paths.absPagesPath,
    });
    return exactLocalePaths(localeList);
  });

  api.addUmiExports(() => {
    return {
      exportAll: true,
      source: `../plugin-locale/localeExports`,
    };
  });
};
