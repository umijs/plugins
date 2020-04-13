import { IApi } from 'umi';
import { join } from 'path';
import { readFileSync } from 'fs';
import AntdDayjsWebpackPlugin from 'antd-dayjs-webpack-plugin';

const DIR_NAME = 'plugin-dayjs';

export default (api: IApi) => {
  if (!api.userConfig.dayjs) return;
  api.describe({
    key: 'dayjs',
    config: {
      schema(joi) {
        return joi.boolean();
      },
    },
  });

  api.chainWebpack(webpackConfig => {
    webpackConfig.plugin('dayjs').use(AntdDayjsWebpackPlugin);
    return webpackConfig;
  });
  // 如果配置了 locale 需要导入对应的语言包
  if (api.userConfig.locale) {
    api.onGenerateFiles(() => {
      api.writeTmpFile({
        path: join(DIR_NAME, 'runtime.tsx'),
        content: readFileSync(join(__dirname, 'runtime.tsx.tpl'), 'utf-8'),
      });
    });

    api.addEntryCodeAhead(() => `require('./plugin-dayjs/runtime');`.trim());
  } else {
    // 没多语言，默认添加一个中文
    api.addEntryCodeAhead(() => `import 'dayjs/locale/zh-cn';`.trim());
  }
};
