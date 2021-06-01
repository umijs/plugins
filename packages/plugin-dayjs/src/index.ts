import { IApi } from 'umi';
import AntdDayjsWebpackPlugin from 'antd-dayjs-webpack-plugin';

export default (api: IApi) => {
  api.describe({
    key: 'dayjs',
    config: {
      schema(joi) {
        return joi.object({
          plugins: joi.array(),
          replaceMoment: joi.boolean(),
          preset: joi.string(),
        });
      },
    },
  });

  const { dayjs } = api.userConfig;

  api.chainWebpack((config) => {
    config
      .plugin('antd-dayjs-webpack-plugin')
      .use(AntdDayjsWebpackPlugin, [dayjs])
      .end();
    return config;
  });
};
