import { IApi } from 'umi';

export default (api: IApi) => {
  api.describe({
    key: 'lodash',
  });

  api.modifyBabelPresetOpts(opts => {
    return {
      ...opts,
      import: (opts.import || []).concat([
        {
          libraryName: 'lodash',
          libraryDirectory: '',
          camel2DashComponentName: false,
        },
      ]),
    };
  });
};
