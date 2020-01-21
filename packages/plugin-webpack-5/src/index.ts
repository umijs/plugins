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
    key: 'webpack5',
  });

  api.modifyBundlerImplementor(() => {
    return webpack;
  });

  api.modifyBundleConfig(memo => {
    // futureEmitAssets is by default
    delete memo.output?.futureEmitAssets;

    // webpack 5 has no node polyfill
    delete memo.node;

    // url polyfill for mini-css-extract-plugin's dep
    memo.resolve?.modules?.push(join(__dirname, '../node_modules'));

    // cache
    memo.cache = {
      type: 'filesystem',
      buildDependencies: {},
    };

    return memo;
  });
};
