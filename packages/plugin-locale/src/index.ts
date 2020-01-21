import { IApi } from 'umi';
import { join } from 'path';
import { getLocaleList, isNeedPolyfill, exactLocalePaths } from './utils';

interface IOpts {
  default?: string;
  baseNavigator?: boolean;
  antd?: boolean;
  baseSeparator?: string;
}

type ILocaleOpts = IOpts | boolean;

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
  const separator = config?.locale?.separator || '-';

  const localeList = getLocaleList({
    localeFolder,
    separator,
    absSrcPath: paths.absSrcPath,
    absPagesPath: paths.absPagesPath,
  });

  const localeFileList = exactLocalePaths(localeList);

  api.babelRegister.setOnlyMap({
    key: 'locale',
    value: localeFileList,
  });
};
