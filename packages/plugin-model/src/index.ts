import { join } from 'path';
import { IApi, utils } from 'umi';
import { DIR_NAME_IN_TMP } from './constants';
import { getTmpFile } from './utils/getTmpFile';
import { readFileSync } from 'fs';

export default (api: IApi) => {
  const {
    paths,
    utils: { winPath },
  } = api;

  function getModelsPath() {
    return join(paths.absSrcPath!, api.config!.singular ? 'model' : 'models');
  }

  // Add provider wrapper with rootContainer
  api.addRuntimePlugin(() => '../plugin-model/runtime');

  api.onGenerateFiles(async () => {
    const modelsPath = getModelsPath();
    try {
      const hasInitialState =
        api.hasPlugins(['@umijs/plugin-initial-state']) &&
        readFileSync(
          join(api.paths.absTmpPath!, 'plugin-initial-state/enable.conf'),
          'utf-8',
        ) === 'true';
      const additionalModels = await api.applyPlugins({
        key: 'addExtraModels',
        type: api.ApplyPluginsType.add,
        initialValue: [],
      });

      const tmpFiles = getTmpFile(
        modelsPath,
        hasInitialState ? additionalModels : [],
      );

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
