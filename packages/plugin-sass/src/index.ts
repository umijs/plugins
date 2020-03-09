import { IApi, utils } from 'umi';

export default (api: IApi) => {
  api.describe({
    config: {
      schema(joi) {
        return joi.object({
          implementation: joi.any(),
          sassOptions: joi.object(),
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
