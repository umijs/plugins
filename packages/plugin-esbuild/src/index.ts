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
      const userConfigTargets = api.config.targets;
      let defaultEsbuildTargets: string | string[] = 'es5';
      function isTargetsES5() {
        return (
          userConfigTargets &&
          (userConfigTargets.ie !== false ||
            userConfigTargets.chrome < 51 ||
            userConfigTargets.edge < 15 ||
            userConfigTargets.ios < 10 ||
            userConfigTargets.safari < 10 ||
            userConfigTargets.firefox < 54)
        );
      }
      if (!isTargetsES5()) {
        userConfigTargets &&
          Object.keys(userConfigTargets).forEach((key) => {
            if (
              key === 'node' ||
              key === 'ie' ||
              userConfigTargets[key] === false
            )
              return;
            if (!Array.isArray(defaultEsbuildTargets))
              defaultEsbuildTargets = [];
            defaultEsbuildTargets.push(`${key}${userConfigTargets[key]}`);
          });
      }
      const { target = defaultEsbuildTargets, pure } = api.config.esbuild || {};
      const optsMap = {
        [BundlerConfigType.csr]: {
          minify: true,
          target,
          pure,
        },
        [BundlerConfigType.ssr]: {
          target: 'node10',
          minify: true,
          pure,
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
