import { IApi, utils } from 'umi';
import { join, relative } from 'path';
import providerContent from './utils/getProviderContent';
import getModelContent from './utils/getModelContent';
import getExportContent from './utils/getExportContent';
import {
  DIR_NAME,
  RELATIVE_MODEL,
  RELATIVE_MODEL_PATH,
  RELATIVE_EXPORT,
  RELATIVE_EXPORT_PATH,
} from './constants';

const { winPath, getFile } = utils;

export default (api: IApi) => {
  const { paths } = api;
  // 注册 getInitialState 方法
  api.addRuntimePluginKey(() => 'getInitialState');

  // Add provider to prevent render
  api.addRuntimePlugin(() => join(winPath(__dirname), './runtime'));

  api.onGenerateFiles(() => {
    api.writeTmpFile({
      path: join(DIR_NAME, 'Provider.tsx'),
      content: providerContent,
    });
    const entryFile = getFile({
      base: paths.absSrcPath || '',
      type: 'javascript',
      fileNameWithoutExt: 'app',
    })?.path;

    if (entryFile) {
      const relEntryFile = relative(paths.cwd || '', entryFile);
      api.writeTmpFile({
        path: RELATIVE_MODEL_PATH,
        content: getModelContent(relEntryFile),
      });
      api.writeTmpFile({
        path: RELATIVE_EXPORT_PATH,
        content: getExportContent(RELATIVE_MODEL),
      });
    } else {
      api.logger.warn(
        '[@umijs/plugin-initial-state]: 检测到 @umijs/plugin-initial-state 插件已经开启，但是不存在 app.ts/js 入口文件。',
      );
    }
  });

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
        absPath: winPath(join(paths.absTmpPath || '', RELATIVE_MODEL_PATH)),
        namespace: '@@initialState',
      },
    ],
  });
};
