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
    if (memo.optimization && type === BundlerConfigType.csr) {
      memo.optimization.minimizer = [
        new (require('esbuild-webpack-plugin').default)(),
      ];
    }
    return memo;
  });
};
