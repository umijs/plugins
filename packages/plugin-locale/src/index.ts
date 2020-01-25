import { IApi, utils } from 'umi';
import { existsSync, readFileSync } from 'fs';
import { basename, join, dirname } from 'path';
import polyfill from './polyfill';

const momentLocation = require
  .resolve('moment/locale/zh-cn')
  .replace(/zh\-cn\.js$/, '');

function getMomentLocale(lang: string, country: string) {
  if (
    existsSync(
      join(momentLocation, `${lang}-${country.toLocaleLowerCase()}.js`),
    )
  ) {
    return `${lang}-${country.toLocaleLowerCase()}`;
  }
  if (existsSync(join(momentLocation, `${lang}.js`))) {
    return lang;
  }
  return '';
}

export function getLocaleFileList(
  absSrcPath: string,
  absPagesPath: string,
  singular: boolean,
  separator = '-',
) {
  const localeFileMath = new RegExp(
    `^([a-z]{2})${separator}?([A-Z]{2})?\.(js|ts)$`,
  );
  const localeFolder = singular ? 'locale' : 'locales';
  const localeFiles = utils.glob
    .sync('*.{ts,js}', {
      cwd: join(absSrcPath, localeFolder),
    })
    .map((name: string) => join(absSrcPath, localeFolder, name))
    .concat(
      utils.glob
        .sync(`**/${localeFolder}/*.{ts,js}`, {
          cwd: absPagesPath,
        })
        .map((name: string) => join(absPagesPath, name)),
    )
    .filter((p: string) => localeFileMath.test(basename(p)))
    .map((fullname: string) => {
      const fileName = basename(fullname);
      const fileInfo = localeFileMath
        .exec(fileName)!
        .slice(1, 3)
        .filter(Boolean);
      return {
        name: fileInfo.join(separator),
        path: fullname,
      };
    });
  const groups = utils.lodash.groupBy(localeFiles, 'name');
  return Object.keys(groups).map(name => {
    const fileInfo = name.split(separator);
    return {
      lang: fileInfo[0],
      name,
      country: fileInfo[1] || fileInfo[0].toUpperCase(),
      paths: groups[name].map(item => utils.winPath(item.path)),
      momentLocale: getMomentLocale(fileInfo[0], fileInfo[1] || ''),
    };
  });
}

export default (api: IApi) => {
  const {
    paths,
    utils: { Mustache, lodash, winPath },
  } = api;

  // 补丁
  polyfill({ api });

  // 配置
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
    const localeConfig = (api.config as any).locale;
    const baseSeparator = localeConfig?.baseSeparator || '-';
    const defaultLocale = localeConfig?.default || `zh${baseSeparator}CN`;
    const [lang, country] = defaultLocale.split(baseSeparator);
    const localeFileList = getLocaleFileList(
      paths.absSrcPath!,
      paths.absPagesPath!,
      api.config.singular!,
      baseSeparator,
    );
    api.writeTmpFile({
      path: 'plugin-locale/LocaleWrapper.tsx',
      content: Mustache.render(
        readFileSync(join(__dirname, 'wrapper.tsx.tpl'), 'utf-8'),
        {
          baseSeparator,
          localeList: localeFileList,
          antd: localeConfig?.antd !== false,
          baseNavigator: localeConfig?.baseNavigator !== false,
          useLocalStorage: localeConfig?.useLocalStorage !== false,
          defaultLocale,
          defaultLang: lang,
          defaultAntdLocale: `${lang}_${country}`,
          defaultMomentLocale: getMomentLocale(lang, country),
          reactIntlDir: dirname(require.resolve('react-intl/package')),
          localeLibPath: require.resolve('./locale'),
        },
      ),
    });
  });
  api.addTmpGenerateWatcherPaths(() => {
    return join(paths.absSrcPath!, api.config.singular ? 'locale' : 'locales');
  });

  // Runtime Plugin
  api.addRuntimePlugin(() => join(__dirname, '../src/runtime.tsx'));
  api.addRuntimePluginKey(() => 'locale');

  // Bundler Config
  api.modifyBundleConfig((memo, { bundler }) => {
    if (bundler.id === 'webpack') {
      memo.resolve!.alias!['umi/locale'] = require.resolve('./locale');
    }
    return memo;
  });
};
