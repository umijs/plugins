import { IApi } from 'umi';

export default (api: IApi) => {
  // disable by default
  if (!api.userConfig.crossorigin) return;

  api.describe({
    key: 'crossorigin',
    config: {
      schema(joi) {
        return joi.boolean();
      },
    },
  });

  api.chainWebpack(webpackConfig => {
    webpackConfig.output.crossOriginLoading('anonymous');
    return webpackConfig;
  });

  // last exec
  api.modifyHTML({
    fn: $ => {
      $('script').each((i: number, elem) => {
        const el = $(elem);
        // 在 local 的 script 标签上添加 crossorigin="anonymous"
        if (el.attr('src') && !/^(https?:)?\/\//.test(el.attr('src')!)) {
          el.attr('crossorigin', 'anonymous');
        }
      });
      return $;
    },
    stage: Infinity,
  });
};
