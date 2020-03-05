import { IApi, utils } from 'umi';
import { join, relative } from 'path';
import providerContent from './utils/getProviderContent';
import getModelContent from './utils/getModelContent';
import getExportContent from './utils/getExportContent';
import { shouldPluginEnable } from './utils';
import {
  DIR_NAME,
  RELATIVE_MODEL,
  RELATIVE_MODEL_PATH,
  RELATIVE_EXPORT,
  RELATIVE_EXPORT_PATH,
} from './constants';

const { winPath, getFile } = utils;

export default (api: IApi) => {
  // 注册 getInitialState 方法
  api.addRuntimePluginKey(() => 'getInitialState');

  api.addRuntimePlugin(() => join(__dirname, 'runtime'));

  api.addUmiExports(() => [
    {
      exportAll: true,
      source: `../${RELATIVE_EXPORT}`,
    },
  ]);

  api.register({
    key: 'addExtraModels',
    fn: () => [
      {
        absPath: winPath(join(api.paths.absTmpPath!, RELATIVE_MODEL_PATH)),
        namespace: '@@initialState',
      },
    ],
  });

  api.addTmpGenerateWatcherPaths(() => [
    './app.ts',
    './app.js',
    './app.jsx',
    './app.tsx',
  ]);

  api.onGenerateFiles(async () => {
    const entryFile = getFile({
      base: api.paths.absSrcPath!,
      type: 'javascript',
      fileNameWithoutExt: 'app',
    })?.path;

    api.writeTmpFile({
      path: winPath(join(DIR_NAME, 'Provider.tsx')),
      content: providerContent,
    });

    api.writeTmpFile({
      path: winPath(RELATIVE_EXPORT_PATH),
      content: getExportContent(RELATIVE_MODEL),
    });

    const relEntryFile = relative(api.paths.cwd!, entryFile || '');

    const enable = await shouldPluginEnable(entryFile);

    api.writeTmpFile({
      path: RELATIVE_MODEL_PATH,
      content: getModelContent(enable ? relEntryFile : ''),
    });
  });
};
