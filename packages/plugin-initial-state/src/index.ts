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
  // 注册 getInitialState 方法
  api.addRuntimePluginKey(() => 'getInitialState');

  const entryFile = getFile({
    base: winPath(api.paths.absSrcPath!),
    type: 'javascript',
    fileNameWithoutExt: 'app',
  })?.path;

  if (entryFile) {
    // Add provider to prevent render
    api.addRuntimePlugin(() => winPath(join(__dirname, 'runtime')));
    api.addUmiExports(() => [
      {
        exportAll: true,
        source: winPath(`../${RELATIVE_EXPORT}`),
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
  }

  api.onGenerateFiles(() => {
    if (entryFile) {
      api.writeTmpFile({
        path: winPath(join(DIR_NAME, 'Provider.tsx')),
        content: providerContent,
      });
      api.writeTmpFile({
        path: winPath(RELATIVE_EXPORT_PATH),
        content: getExportContent(RELATIVE_MODEL),
      });
      const relEntryFile = relative(api.paths.cwd!, entryFile);
      api.writeTmpFile({
        path: winPath(RELATIVE_MODEL_PATH),
        content: getModelContent(relEntryFile),
      });
    } else {
      api.logger.info(
        '[@umijs/plugin-initial-state]: 检测到 @umijs/plugin-initial-state 插件已经开启，但是不存在 app.ts/js 入口文件。',
      );
    }
  });
};
