import { IApi, BundlerConfigType } from 'umi';

export default (api: IApi) => {
  api.describe({
    key: 'webWorker',
    config: {
      default: {
        inline: 'no-fallback',
      },
      schema(joi) {
        return joi
          .object({
            worker: joi.alternatives(joi.string(), joi.object()),
            publicPath: joi.alternatives(joi.string(), joi.function()),
            filename: joi.alternatives(joi.string(), joi.function()),
            chunkFilename: joi.string(),
            inline: joi.string().valid('no-fallback', 'fallback'),
            esModule: joi.boolean(),
          })
          .unknown()
          .description(
            'more: https://github.com/webpack-contrib/worker-loader#options',
          );
      },
    },
    enableBy: api.EnableBy.config,
  });

  api.chainWebpack((config, { type }) => {
    if (type === BundlerConfigType.csr) {
      // only csr build
      // if you use SSR, please typeof onmessage !== 'undefined' in worker.js
      config.module
        .rule('web-worker-js')
        .exclude.add(/node_modules/)
        .end()
        .test(/\.worker\.(js|mjs|ts)$/)
        .use('worker-loader')
        .loader(require.resolve('worker-loader'))
        .options(api.config?.webWorker || {});
    }
    return config;
  });
};
