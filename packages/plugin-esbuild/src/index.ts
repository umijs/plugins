import { IApi, BundlerConfigType } from 'umi';
import { ESBuildPlugin, ESBuildMinifyPlugin } from 'esbuild-loader';

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
          target: 'es2015',
          minify: true,
        },
        [BundlerConfigType.ssr]: {
          target: 'node10',
          minify: true,
        },
      };
      const opts = optsMap[type] || optsMap[BundlerConfigType.csr];
      memo.optimization.minimize = true;
      memo.optimization.minimizer = [new ESBuildMinifyPlugin(opts)];
    }
    if (memo.plugins) {
      memo.plugins.push(new ESBuildPlugin());
    }
    return memo;
  });
};
