import { IApi } from 'umi';
import { join } from 'path';
// @ts-ignore
import webpack from 'webpack';

// ref:
// https://blog.logrocket.com/new-features-in-webpack-5-2559755adf5e/
// https://webpack.js.org/migrate/5/
// https://github.com/webpack/webpack/issues/9802
export default (api: IApi) => {
  api.describe({
    config: {
      schema(joi) {
        return joi.boolean();
      },
    },
  });

  api.modifyBundleConfigOpts(memo => {
    memo.miniCSSExtractPluginPath = require.resolve('mini-css-extract-plugin');
    memo.miniCSSExtractPluginLoaderPath = require.resolve(
      'mini-css-extract-plugin/dist/loader',
    );
    return memo;
  });

  api.modifyBundleImplementor(() => {
    return webpack;
  });

  api.modifyBundleConfig(memo => {
    // futureEmitAssets is by default
    delete memo.output?.futureEmitAssets;

    // webpack 5 has no node polyfill
    delete memo.node;

    // url polyfill for mini-css-extract-plugin's dep
    memo.resolve!.modules?.push(join(__dirname, '../node_modules'));

    // antd-pro 的依赖里，intl-messageformat 用了 jsnext:main
    memo.resolve!.mainFields = ['browser', 'module', 'jsnext:main', 'main'];

    // cache
    memo.cache = {
      type: 'filesystem',
      buildDependencies: {},
      cacheDirectory: join(api.paths.absTmpPath!, '.cache', 'webpack'),
    };

    return memo;
  });
};
