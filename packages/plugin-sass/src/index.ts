import { IApi, utils } from 'umi';

export default (api: IApi) => {
  api.describe({
    config: {
      schema(Joi) {
        return Joi.object({
          implementation: Joi.any(),
          sassOptions: Joi.object(),
          prependData: Joi.alternatives(Joi.string(), Joi.func()),
          sourceMap: Joi.boolean(),
          webpackImporter: Joi.boolean(),
        });
      },
    },
  });

  api.chainWebpack((memo, { createCSSRule }) => {
    createCSSRule({
      lang: 'sass',
      test: /\.(sass|scss)(\?.*)?$/,
      loader: require.resolve('sass-loader'),
      options: utils.deepmerge(
        {
          implementation: require('sass'),
        },
        api.config.sass || {},
      ),
    });
    return memo;
  });
};
