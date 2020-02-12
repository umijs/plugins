import { IApi } from 'umi';
import { readFileSync } from 'fs';
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

export default (api: IApi) => {
  const {
    paths,
    utils: { winPath, getFile },
  } = api;
  // 注册 getInitialState 方法
  api.addRuntimePluginKey(() => 'getInitialState');

  api.onGenerateFiles(() => {
    const runtimeContent = readFileSync(
      require.resolve(join(__dirname, 'runtime')),
      'utf-8',
    );
    api.writeTmpFile({
      path: join(DIR_NAME, 'runtime.tsx'),
      content: runtimeContent,
    });

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
      source: winPath(join(paths.absTmpPath || '', RELATIVE_EXPORT)),
    },
  ]);

  // Add provider to prevent render
  api.addRuntimePlugin(() => join(paths.absTmpPath!, DIR_NAME, 'runtime.tsx'));

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
