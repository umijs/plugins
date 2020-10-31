import { join } from 'path';
import { IApi, utils } from 'umi';
import { DIR_NAME_IN_TMP } from './constants';
import { getTmpFile } from './utils/getTmpFile';
import { getModels } from './utils/getModels';
import { readFileSync } from 'fs';
const { lodash } = utils;

export default (api: IApi) => {
  const {
    paths,
    utils: { winPath },
  } = api;

  function getModelDir() {
    return api.config.singular ? 'model' : 'models';
  }

  function getModelsPath() {
    return join(paths.absSrcPath!, getModelDir());
  }

  function getAllModels() {
    const srcModelsPath = getModelsPath();
    return lodash.uniq([
      ...getModels(srcModelsPath),
      ...getModels(
        paths.absPagesPath!,
        `**/${getModelDir()}/**/*.{ts,tsx,js,jsx}`,
      ),
      ...getModels(paths.absPagesPath!, `**/*.model.{ts,tsx,js,jsx}`),
    ]);
  }

  // Add provider wrapper with rootContainer
  api.addRuntimePlugin(() => '../plugin-model/runtime');

  api.onGenerateFiles(async () => {
    const files = getAllModels();

    try {
      const additionalModels = await api.applyPlugins({
        key: 'addExtraModels',
        type: api.ApplyPluginsType.add,
        initialValue: [],
      });

      const tmpFiles = getTmpFile(files, additionalModels, paths.absSrcPath!);

      // provider.tsx
      api.writeTmpFile({
        path: `${DIR_NAME_IN_TMP}/Provider.tsx`,
        content: tmpFiles.providerContent,
      });

      // useModel.tsx
      api.writeTmpFile({
        content: tmpFiles.useModelContent,
        path: `${DIR_NAME_IN_TMP}/useModel.tsx`,
      });

      // runtime.tsx
      api.writeTmpFile({
        path: 'plugin-model/runtime.tsx',
        content: utils.Mustache.render(
          readFileSync(join(__dirname, 'runtime.tsx.tpl'), 'utf-8'),
          {},
        ),
      });
    } catch (e) {
      console.error(e);
    }
  });

  api.addTmpGenerateWatcherPaths(() => {
    const modelsPath = getModelsPath();
    return [modelsPath];
  });

  // Export useModel and Models from umi
  api.addUmiExports(() => [
    {
      exportAll: true,
      source: `../${DIR_NAME_IN_TMP}/useModel`,
    },
  ]);
};
