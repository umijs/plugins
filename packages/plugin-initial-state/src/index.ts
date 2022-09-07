import { IApi, utils } from 'umi';
import { join, relative } from 'path';
import providerContent from './utils/getProviderContent';
import getModelContent from './utils/getModelContent';
import getExportContent from './utils/getExportContent';
import { shouldPluginEnable } from './utils/shouldPluginEnable';
import {
  DIR_NAME,
  RELATIVE_MODEL,
  RELATIVE_MODEL_PATH,
  RELATIVE_EXPORT,
  RELATIVE_EXPORT_PATH,
} from './constants';
import { readFileSync } from 'fs';
import codeFrame from '@umijs/deps/compiled/babel/code-frame';

const { winPath, getFile } = utils;

export default (api: IApi) => {
  // 注册 getInitialState 方法
  api.addRuntimePluginKey(() => 'getInitialState');

  api.addRuntimePluginKey(() => 'initialStateConfig');

  api.addRuntimePlugin(() => '../plugin-initial-state/runtime');

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
    let enable = false;

    try {
      enable = shouldPluginEnable(entryFile);
    } catch (e) {
      const error: any = e;
      api.logger.error(`parse ${entryFile} Failed`);
      if (error.loc && entryFile) {
        const code = readFileSync(entryFile, 'utf-8');
        const frame = codeFrame(code, error.loc.line, error.loc.column + 1, {
          highlightCode: true,
        });
        console.log(frame);
      }
      throw e;
    }

    api.writeTmpFile({
      path: RELATIVE_MODEL_PATH,
      content: getModelContent(enable ? relEntryFile : ''),
    });

    api.writeTmpFile({
      path: 'plugin-initial-state/runtime.tsx',
      content: utils.Mustache.render(
        readFileSync(join(__dirname, 'runtime.tsx.tpl'), 'utf-8'),
        {},
      ),
    });
  });
};
