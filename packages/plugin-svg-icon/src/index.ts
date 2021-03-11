import { IApi } from 'umi';
import { join } from 'path';

export default (api: IApi) => {
  api.describe({
    config: {
      schema(Joi) {
        return Joi.object({
          svgoConfig: Joi.any(),
        });
      },
    },
  });
  const srcDir = api.paths.absSrcPath;
  const svgsDir = join(srcDir!, 'assets/svgs');
  const svgoConfigFile = api.utils.winPath(join(srcDir!, 'svgo-config.json'));
  api.chainWebpack((config) => {
    // 默认的svg的模块规则中不去匹配src/assets/svgs，避免此文件中的内容使用默认的url-loader的加载形式
    config.module.rule('svg').exclude.add(svgsDir).end();
    config.module
      .rule('svg-sprite-svgo-loader')
      .test(/\.svg$/)
      .include.add(svgsDir) //处理svg目录
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end()
      .use('svgo-loader')
      .loader('svgo-loader')
      .options(api.config.svgIcon.svgoConfig || svgoConfigFile);
    return config;
  });
};
