import { dirname } from 'path';
import { IApi } from 'umi';

export default (api: IApi) => {
  api.describe({
    config: {
      schema(joi) {
        return joi.object();
      },
    },
  });

  api.modifyBabelPresetOpts(opts => {
    return {
      ...opts,
      import: (opts.import || []).concat([
        { libraryName: 'antd', libraryDirectory: 'es', style: true },
        { libraryName: 'antd-mobile', libraryDirectory: 'es', style: true },
      ]),
    };
  });

  api.addProjectFirstLibraries(() => [
    {
      name: 'antd',
      path: dirname(require.resolve('antd/package.json')),
    },
    {
      name: 'antd-mobile',
      path: dirname(require.resolve('antd-mobile/package.json')),
    },
  ]);
};
