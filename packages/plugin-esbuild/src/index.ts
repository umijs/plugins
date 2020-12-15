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
      const optsMap = {
        [BundlerConfigType.csr]: {
          target: 'chrome49',
        },
        [BundlerConfigType.ssr]: {
          target: 'node10',
        },
      };
      const opts = optsMap[type] || optsMap[BundlerConfigType.csr];
      memo.optimization.minimizer = [
        new (require('esbuild-webpack-plugin').default)(opts),
      ];
    }
    return memo;
  });
};
