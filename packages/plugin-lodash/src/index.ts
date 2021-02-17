import { IApi } from 'umi';

export default (api: IApi) => {
  api.modifyBabelPresetOpts((opts) => {
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
