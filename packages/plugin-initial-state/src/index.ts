import { IApi, utils } from 'umi';
import { join, relative } from 'path';
import { readFileSync } from 'fs';
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
const { init, parse } = require('es-module-lexer');

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

  api.onGenerateFiles(() => {
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

    let hasExport = false;
    if (entryFile) {
      init.then(() => {
        const fileContent = readFileSync(entryFile, { encoding: 'utf-8' });
        const [_, exportsList] = parse(fileContent);
        hasExport = exportsList
          .toString()
          .split(',')
          .includes('getInitialState');

        api.writeTmpFile({
          path: RELATIVE_MODEL_PATH,
          content: getModelContent(entryFile && hasExport ? relEntryFile : ''),
        });
      });
    }
  });
};
