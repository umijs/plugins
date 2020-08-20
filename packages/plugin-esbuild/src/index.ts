import { IApi } from 'umi';

export default (api: IApi) => {
  api.describe({
    key: 'esbuild',
    config: {
      schema(joi) {
        return joi.object();
      },
    },
    enableBy: api.EnableBy.config,
  });

  api.modifyBundleConfig(memo => {
    if (memo.optimization) {
      memo.optimization.minimizer = [
        new (require('esbuild-webpack-plugin').default)({ target: 'chrome49' }),
      ];
    }
    return memo;
  });
};
