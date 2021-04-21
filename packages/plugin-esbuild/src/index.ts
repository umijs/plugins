import { IApi, BundlerConfigType } from 'umi';
import { ESBuildPlugin, ESBuildMinifyPlugin } from 'esbuild-loader';

export default (api: IApi) => {
  api.describe({
    key: 'esbuild',
    config: {
      schema(joi) {
        return joi.object({
          target: joi.alternatives(
            joi.string(),
            joi.array().items(joi.string()),
          ),
        });
      },
    },
    enableBy: api.EnableBy.config,
  });

  api.modifyBundleConfig((memo, { type }) => {
    if (memo.optimization) {
      const { target = 'es2015' } = api.config.esbuild || {};
      const optsMap = {
        [BundlerConfigType.csr]: {
          minify: true,
          target,
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
