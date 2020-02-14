import { join } from 'path';
import { IApi } from 'umi';
import { DIR_NAME_IN_TMP } from './constants';
import { getTmpFile } from './utils/getTmpFile';

export default (api: IApi) => {
  const {
    paths,
    utils: { winPath },
  } = api;

  function getModelsPath() {
    return join(paths.absSrcPath!, api.config!.singular ? 'model' : 'models');
  }

  // Add provider wrapper with rootContainer
  api.addRuntimePlugin(() => join(winPath(__dirname), './runtime'));

  api.onGenerateFiles(async () => {
    const modelsPath = getModelsPath();
    try {
      const additionalModels = await api.applyPlugins({
        key: 'addExtraModels',
        type: api.ApplyPluginsType.add,
        initialValue: [],
      });

      const tmpFiles = getTmpFile(modelsPath, additionalModels);

      // Write models/provider.tsx
      api.writeTmpFile({
        path: `${DIR_NAME_IN_TMP}/Provider.tsx`,
        content: tmpFiles.providerContent,
      });
      // Write models/useModel.tsx
      api.writeTmpFile({
        content: tmpFiles.useModelContent,
        path: `${DIR_NAME_IN_TMP}/useModel.tsx`,
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
