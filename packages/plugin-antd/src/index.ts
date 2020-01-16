import { dirname } from 'path';
import { IApi } from '@umijs/types';

export default (api: IApi) => {
  api.modifyBabelOpts(opts => {
    return opts;
  });

  api.modifyBabelPresetOpts(opts => {
    return {
      ...opts,
      import: (opts.import || []).concat([
        { libraryName: 'antd', libraryDirectory: 'es', style: true },
        { libraryName: 'antd-mobile', libraryDirectory: 'es', style: true },
        {
          libraryName: 'ant-design-pro',
          libraryDirectory: 'lib',
          style: true,
          camel2DashComponentName: false,
        },
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
