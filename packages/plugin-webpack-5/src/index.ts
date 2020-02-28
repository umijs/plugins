import { IApi } from 'umi';
import { join } from 'path';
// @ts-ignore
import webpack from 'webpack';

// ref:
// https://blog.logrocket.com/new-features-in-webpack-5-2559755adf5e/
// https://webpack.js.org/migrate/5/
// https://github.com/webpack/webpack/issues/9802
// https://github.com/webpack/changelog-v5/blob/master/guides/persistent-caching.md
export default (api: IApi) => {
  api.describe({
    config: {
      schema(joi) {
        return joi.object();
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
    // futureEmitAssets is enabled by default
    delete memo.output?.futureEmitAssets;

    // webpack 5 has no node polyfill
    delete memo.node;

    // url polyfill for mini-css-extract-plugin's dep
    memo.resolve!.modules?.push(join(__dirname, '../node_modules'));

    // antd-pro 的依赖里，intl-messageformat 用了 jsnext:main
    memo.resolve!.mainFields = ['browser', 'module', 'jsnext:main', 'main'];

    // polyfills
    memo.resolve!.alias!.tty = require.resolve('tty-browserify');

    // cache
    memo.cache = {
      type: 'filesystem',
      buildDependencies: {},
      cacheDirectory: join(api.paths.absTmpPath!, '.cache', 'webpack'),
    };

    return memo;
  });

  api.modifyDefaultConfig(memo => {
    // dev 模式开启 styleLoader，因为 mini-css-extract-plugin 和 webpack@5 的物理缓存有冲突
    if (api.env === 'development') {
      memo.styleLoader = {};
    }
    return memo;
  });
};
