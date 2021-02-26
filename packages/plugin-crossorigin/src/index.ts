import { IApi } from 'umi';

interface ICrossOriginOpts {
  include?: RegExp[];
}

export default (api: IApi) => {
  // disable by default
  if (!api.userConfig.crossorigin) return;

  api.describe({
    key: 'crossorigin',
    config: {
      schema(joi) {
        return joi.alternatives(
          joi.boolean(),
          joi.object({
            include: joi.array().items(joi.object().instance(RegExp)),
          }),
        );
      },
    },
  });

  api.chainWebpack((webpackConfig) => {
    webpackConfig.output.crossOriginLoading('anonymous');
    return webpackConfig;
  });

  const opts: ICrossOriginOpts = api.userConfig.crossorigin || {};
  const include = opts.include || [];

  // last exec
  api.modifyHTML({
    fn: ($) => {
      $('script').each((i: number, elem) => {
        const el = $(elem);
        const scriptSrc = el.attr('src');

        if (!scriptSrc) {
          return;
        }

        // 在 local 的 script 标签上添加 crossorigin="anonymous"
        if (!/^(https?:)?\/\//.test(scriptSrc!)) {
          el.attr('crossorigin', 'anonymous');
        }

        if (include.some((reg) => reg.test(scriptSrc))) {
          el.attr('crossorigin', 'anonymous');
        }
      });
      return $;
    },
    stage: Infinity,
  });
};
