import { join } from 'path';
import { IApi } from 'umi';
import { DIR_NAME_IN_TMP } from './constants';
import getProviderContent from './utils/getProviderContent';
import getUseModelContent from './utils/getUseModelContent';

export default (api: IApi) => {
  const {
    paths,
    utils: { winPath },
  } = api;

  function getModelsPath() {
    return join(paths.absSrcPath!, api.config.singular ? 'model' : 'models');
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
      // Write models/provider.tsx
      api.writeTmpFile({
        path: `${DIR_NAME_IN_TMP}/Provider.tsx`,
        content: getProviderContent(modelsPath, additionalModels),
      });
      // Write models/useModel.tsx
      api.writeTmpFile({
        content: getUseModelContent(),
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
      source: winPath(join(paths.absTmpPath!, DIR_NAME_IN_TMP, 'useModel')),
    },
  ]);
};
