import { IApi } from 'umi';
import { join } from 'path';

export default (api: IApi) => {
  api.describe({
    config: {
      schema(Joi) {
        return Joi.object({
          // svgoConfig: Joi.string(),
        });
      },
    },
  });
  const srcDir = api.paths.absSrcPath;
  const svgsDir = join(srcDir!, 'assets/svgs');
  let svgoConfigDirFile = null;
  //项目根目录位置
  const svgoConfigDirFilePath = api.utils.winPath(
    join(srcDir!, '../svgo-config.json'),
  );
  //插件根目录位置
  const svgoConfigDefaultFilePath = api.utils.winPath('../svgo-config.json');
  try {
    //如果配置文件不存在使用默认配置
    svgoConfigDirFile = require.resolve(svgoConfigDirFilePath);
  } catch (e) {
    console.log(
      api.utils.chalk.yellow(
        `[svg-icon]svgo-config.json doesn't find at ${svgoConfigDirFilePath}, svg-icon auto use default config`,
      ),
    );
  }
  const svgoConfigDefaultFile = require.resolve(svgoConfigDefaultFilePath);
  const svgoConfigFile = svgoConfigDirFile ?? svgoConfigDefaultFile;

  const svgoConfig = require(svgoConfigFile);
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
      .options(svgoConfig);
    return config;
  });
};
