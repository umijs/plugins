import { IApi, utils } from 'umi';
import { join } from 'path';
import { readFileSync } from 'fs';

const { Mustache, lodash, winPath } = utils;
export default (api: IApi) => {
  const { logger } = api;
  api.describe({
    config: {
      schema(Joi) {
        return Joi.object({
          // svgoConfig: Joi.string(),
        });
      },
    },
  });
  //src 路径
  const srcDir = api.paths.absSrcPath;

  function getSvgDir(path: string) {
    return join(srcDir!, path);
  }

  // svg 文件夹路径
  const svgsDir = getSvgDir('assets/svgs');

  //获取svgoConfig 路径
  function getConfigPath() {
    let svgoConfigDirFile = null;
    //项目根目录位置
    const svgoConfigDirFilePath = api.utils.winPath(
      join(srcDir!, '../svgo-config.json'),
    );
    //插件根目录位置
    const svgoConfigDefaultFilePath = api.utils.winPath('../svgo-config.json');
    try {
      svgoConfigDirFile = require.resolve(svgoConfigDirFilePath);
    } catch (e) {
      console.log(
        api.utils.chalk.yellow(
          `[svg-icon]svgo-config.json doesn't find at ${svgoConfigDirFilePath}, svg-icon auto use default config`,
        ),
      );
    }
    const svgoConfigDefaultFile = require.resolve(svgoConfigDefaultFilePath);
    //如果配置文件不存在使用默认配置
    const svgoConfigFile = svgoConfigDirFile ?? svgoConfigDefaultFile;
    return require(svgoConfigFile);
  }

  // 生成svgIcon 组件
  api.onGenerateFiles(() => {
    const svgIcon = readFileSync(join(__dirname, 'svgIcon.tpl'), 'utf-8');
    api.writeTmpFile({
      path: 'plugin-svg-icon/svgIcon.tsx',
      content: Mustache.render(svgIcon, {
        //
        SSR: !!api.config?.ssr,
      }),
    });
  });

  // // 增加 svgIcon 运行时配置
  // api.addRuntimePlugin(() =>
  //   [join(api.paths.absTmpPath!, 'plugin-svg-icon/svgIcon.tsx')],
  // );

  // 导出内容
  api.addUmiExports(() => [
    {
      exportAll: true,
      source: '../plugin-svg-icon/svgIcon',
    },
  ]);
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
      .options(getConfigPath());
    return config;
  });
};
