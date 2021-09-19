import { IApi, utils } from 'umi';

export default (api: IApi) => {
  api.describe({
    config: {
      schema(Joi) {
        return Joi.object({
          stylusOptions: Joi.object(),
          sourceMap: Joi.boolean(),
          webpackImporter: Joi.boolean(),
          additionalData: Joi.alternatives(Joi.string(), Joi.func()),
          implementation: Joi.alternatives(Joi.string(), Joi.func()),
        });
      },
    },
  });

  api.chainWebpack((memo, { createCSSRule }) => {
    createCSSRule({
      lang: 'stylus',
      test: /\.styl(us)?$/,
      loader: require.resolve('stylus-loader'),
      options: utils.deepmerge(
        {
          implementation: require('stylus'),
        },
        api.config.stylus || {},
      ),
    });
    return memo;
  });
};
