import { IApi, BundlerConfigType } from 'umi';

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

  api.modifyBundleConfig((memo, { type }) => {
    if (memo.optimization) {
      const opts =
        type === BundlerConfigType.ssr
          ? {
              platform: 'node',
              // target: [
              //   'node12.19.0',
              // ],
            }
          : { target: 'chrome49', platform: 'browser' };
      memo.optimization.minimizer = [
        new (require('esbuild-webpack-plugin').default)(opts),
      ];
    }
    return memo;
  });
};
