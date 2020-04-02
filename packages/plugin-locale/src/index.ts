import { IApi } from 'umi';
import { join, dirname } from 'path';
import { readFileSync } from 'fs';
import {
  IGetLocaleFileListResult,
  IAddAntdLocales,
  getLocaleList,
  isNeedPolyfill,
  exactLocalePaths,
  getMomentLocale,
  getAntdLocale,
} from './utils';

interface ILocaleConfig {
  default?: string;
  baseNavigator?: boolean;
  useLocalStorage?: boolean;
  /** title 开启国际化 */
  title?: boolean;
  antd?: boolean;
  baseSeparator?: string;
}

export default (api: IApi) => {
  const {
    paths,
    utils: { Mustache, winPath, lodash },
  } = api;

  api.describe({
    key: 'locale',
    config: {
      default: {
        baseNavigator: true,
        useLocalStorage: true,
        baseSeparator: '-',
      },
      schema(joi) {
        return joi.object({
          default: joi.string(),
          useLocalStorage: joi.boolean(),
          baseNavigator: joi.boolean(),
          title: joi.boolean(),
          antd: joi.boolean(),
          baseSeparator: joi.string(),
        });
      },
    },
    enableBy: api.EnableBy.config,
  });

  // polyfill
  if (isNeedPolyfill(api.userConfig?.targets || {})) {
    api.addEntryImportsAhead(() => ({
      source: require.resolve('intl'),
    }));
  }

  const addAntdLocales: IAddAntdLocales = async args =>
    await api.applyPlugins({
      key: 'addAntdLocales',
      type: api.ApplyPluginsType.add,
      initialValue: [
        `antd/${api.config?.ssr ? 'lib' : 'es'}/locale/${getAntdLocale(
          args.lang,
          args.country,
        )}`,
      ],
      args,
    });

  const getList = async (): Promise<IGetLocaleFileListResult[]> => {
    return getLocaleList({
      localeFolder: api.config?.singular ? 'locale' : 'locales',
      separator: api.config.locale?.baseSeparator,
      absSrcPath: paths.absSrcPath,
      absPagesPath: paths.absPagesPath,
      addAntdLocales,
    });
  };

  // add runtime locale
  api.addRuntimePluginKey(() => 'locale');

  // 生成临时文件
  api.onGenerateFiles(async () => {
    const localeTpl = readFileSync(
      join(winPath(__dirname), 'templates', 'locale.tpl'),
      'utf-8',
    );
    const { baseSeparator, baseNavigator, antd, title, useLocalStorage } = api
      .config.locale as ILocaleConfig;
    const defaultLocale = api.config.locale?.default || `zh${baseSeparator}CN`;

    const localeList = await getList();
    const momentLocales = localeList
      .map(({ momentLocale }) => momentLocale)
      .filter(locale => locale);
    const antdLocales = localeList
      .map(({ antdLocale }) => antdLocale)
      .filter(locale => locale);

    let MomentLocales = momentLocales;
    let DefaultMomentLocale = '';
    // set moment default accounding to locale.default
    if (!MomentLocales.length && api.config.locale?.default) {
      const [lang, country = ''] = defaultLocale.split(baseSeparator);
      const { momentLocale } = getMomentLocale(lang, country);
      if (momentLocale) {
        MomentLocales = [momentLocale];
        DefaultMomentLocale = momentLocale;
      }
    }

    let DefaultAntdLocales: string[] = [];
    // set antd default locale
    if (!antdLocales.length && api.config.locale?.antd) {
      const [lang, country = ''] = defaultLocale.split(baseSeparator);
      DefaultAntdLocales = lodash.uniq(
        await addAntdLocales({
          lang,
          country,
        }),
      );
    }

    api.writeTmpFile({
      content: Mustache.render(localeTpl, {
        MomentLocales,
        DefaultMomentLocale,
        DefaultAntdLocales,
        Antd: !!antd,
        Title: title && api.config.title,
        BaseSeparator: baseSeparator,
        DefaultLocale: defaultLocale,
        DefaultLang: defaultLocale,
      }),
      path: 'plugin-locale/locale.tsx',
    });

    const localeExportsTpl = readFileSync(
      join(__dirname, 'templates', 'localeExports.tpl'),
      'utf-8',
    );
    api.writeTmpFile({
      path: 'plugin-locale/localeExports.ts',
      content: Mustache.render(localeExportsTpl, {
        BaseSeparator: baseSeparator,
        BaseNavigator: baseNavigator,
        UseLocalStorage: !!useLocalStorage,
        LocaleDir: api.config.singular ? 'locale' : 'locales',
        LocaleList: localeList,
        Antd: !!antd,
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
    const runtimeTpl = readFileSync(
      join(__dirname, 'templates', 'runtime.tpl'),
      'utf-8',
    );
    api.writeTmpFile({
      path: 'plugin-locale/runtime.tsx',
      content: Mustache.render(runtimeTpl, {
        Title: !!title,
      }),
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
  api.addTmpGenerateWatcherPaths(async () => {
    const localeList = await getList();
    return exactLocalePaths(localeList);
  });

  api.addUmiExports(() => {
    return {
      exportAll: true,
      source: `../plugin-locale/localeExports`,
    };
  });
};
