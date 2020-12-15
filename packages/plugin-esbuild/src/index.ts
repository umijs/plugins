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
        type === BundlerConfigType.csr
          ? {
              target: 'chrome49',
              platform: 'browser',
            }
          : {
              platform: 'node',
            };
      memo.optimization.minimizer = [
        new (require('esbuild-webpack-plugin').default)(opts),
      ];
    }
    return memo;
  });
};
