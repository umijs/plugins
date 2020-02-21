import { utils } from 'umi';
import { join, basename } from 'path';
import { existsSync } from 'fs';

const { glob, winPath, lodash } = utils;

export interface IGetLocaleFileListOpts {
  localeFolder: string;
  separator?: string;
  absSrcPath?: string;
  absPagesPath?: string;
}

export const getMomentLocale = (
  lang: string,
  country: string,
): { momentLocale: string; momentLocalePath: string } => {
  const momentLocation = require
    .resolve('moment/locale/zh-cn')
    .replace(/zh\-cn\.js$/, '');

  // not have en-US using en
  if (lang === 'en' && country?.toLocaleLowerCase() === 'us') {
    return {
      momentLocalePath: '',
      momentLocale: 'en',
    };
  }
  if (
    existsSync(
      join(momentLocation, `${lang}-${country?.toLocaleLowerCase?.()}.js`),
    )
  ) {
    const momentLocale = `${lang}-${country?.toLocaleLowerCase?.()}`;
    return {
      momentLocalePath: require.resolve(`moment/locale/${momentLocale}`),
      momentLocale,
    };
  }
  if (existsSync(join(momentLocation, `${lang}.js`))) {
    return {
      momentLocalePath: require.resolve(`moment/locale/${lang}`),
      momentLocale: lang,
    };
  }
  return { momentLocalePath: '', momentLocale: '' };
};

export interface IGetLocaleFileListResult {
  lang: string;
  country: string;
  name: string;
  paths: string[];
  momentLocale: string;
  momentLocalePath: string;
}

export const getLocaleList = (
  opts: IGetLocaleFileListOpts,
): IGetLocaleFileListResult[] => {
  const {
    localeFolder,
    separator = '-',
    absSrcPath = '',
    absPagesPath = '',
  } = opts;
  const localeFileMath = new RegExp(
    `^([a-z]{2})${separator}?([A-Z]{2})?\.(js|json|ts)$`,
  );

  const localeFiles = glob
    .sync('*.{ts,js,json}', {
      cwd: winPath(join(absSrcPath, localeFolder)),
    })
    .map(name => winPath(join(absSrcPath, localeFolder, name)))
    .concat(
      glob
        .sync(`**/${localeFolder}/*.{ts,js,json}`, {
          cwd: absPagesPath,
        })
        .map(name => winPath(join(absPagesPath, name))),
    )
    .filter(p => localeFileMath.test(basename(p)) && existsSync(p))
    .map(fullName => {
      const fileName = basename(fullName);
      const fileInfo = localeFileMath
        .exec(fileName)
        ?.slice(1, 3)
        ?.filter(Boolean);
      return {
        name: (fileInfo || []).join(separator),
        path: fullName,
      };
    });

  const groups = lodash.groupBy(localeFiles, 'name');

  return Object.keys(groups).map(name => {
    const [lang, country = ''] = name.split(separator);
    const { momentLocalePath, momentLocale } = getMomentLocale(lang, country);
    return {
      lang,
      name,
      country,
      paths: groups[name].map(item => winPath(item.path)),
      momentLocale,
      momentLocalePath,
    };
  });
};

export const exactLocalePaths = (
  data: IGetLocaleFileListResult[],
): string[] => {
  return lodash.flatten(data.map(item => item.paths));
};

export function isNeedPolyfill(targets = {}) {
  // data come from https://caniuse.com/#search=intl
  // you can find all browsers in https://github.com/browserslist/browserslist#browsers
  const polyfillTargets = {
    ie: 10,
    firefox: 28,
    chrome: 23,
    safari: 9.1,
    opera: 12.1,
    ios: 9.3,
    ios_saf: 9.3,
    operamini: Infinity,
    op_mini: Infinity,
    android: 4.3,
    blackberry: Infinity,
    operamobile: 12.1,
    op_mob: 12.1,
    explorermobil: 10,
    ie_mob: 10,
    ucandroid: Infinity,
  };
  return (
    Object.keys(targets).find(key => {
      const lowKey = key.toLocaleLowerCase();
      return polyfillTargets[lowKey] && polyfillTargets[lowKey] >= targets[key];
    }) !== undefined
  );
}
