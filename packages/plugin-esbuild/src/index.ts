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
      const target = api.config.esbuild?.target || ['es2015'];
      const optsMap = {
        [BundlerConfigType.csr]: {
const { target = 'es2015', pure } = api.config.esbuild || {};
          minify: true,
          target,
          pure,
        },
        [BundlerConfigType.ssr]: {
          target: 'node10',
          minify: true,
          pure: api.config.esbuild?.pure,
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
