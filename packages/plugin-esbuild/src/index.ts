import { IApi, BundlerConfigType, ITargets } from 'umi';
import { ESBuildPlugin, ESBuildMinifyPlugin } from 'esbuild-loader';

/**
 * convert umi targets into esbuild targets
 * issue: https://github.com/evanw/esbuild/issues/1060#issuecomment-807864917
 *
 * @param targets
 * @returns
 */
export const getEsbuildTargetFromEngine = (targets: ITargets): string[] => {
  const userTargets = targets;
  switch (true) {
    case 'ie' in userTargets:
      return ['es5'];
    default: {
      const target = Object.keys(userTargets)
        .map((browser) => {
          const version = userTargets[browser];
          if (
            ['chrome', 'edge', 'ios', 'firefox', 'safari'].includes(browser) &&
            Number.isSafeInteger(version)
          ) {
            return `${browser}${version}`;
          }
          return '';
        })
        .filter(Boolean);
      return target?.length > 0 ? target : ['esnext'];
    }
  }
};

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
      const targetForCSR = getEsbuildTargetFromEngine(api.config.targets || {});
      console.log('targetForCSR', targetForCSR);
      const optsMap = {
        [BundlerConfigType.csr]: {
          target: targetForCSR,
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
