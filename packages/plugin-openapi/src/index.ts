import { join } from 'path';
import { IApi } from 'umi';
import { generateService } from '@umijs/openapi';
import { existsSync, mkdirSync } from 'fs';

export default (api: IApi) => {
  api.describe({
    key: 'openapi',
    config: {
      schema(joi) {
        return joi.object();
      },
    },
    enableBy: api.EnableBy.config,
  });

  api.registerCommand({
    name: 'oneapi',
    fn: async () => {
      const openAPIConfig = await api.applyPlugins({
        key: 'oneapi',
        type: api.ApplyPluginsType.add,
        initialValue: {
          mock: false,
        },
      });

      const pageConfig = require(join(api.cwd, 'package.json'));
      const mockFolder = openAPIConfig.mock
        ? join(api.cwd, 'mocks')
        : undefined;

      const serversFolder = join(api.cwd, 'src', 'servers');

      // 如果mock 文件不存在，创建一下
      if (mockFolder && !existsSync(mockFolder)) {
        mkdirSync(mockFolder);
      }

      // 如果mock 文件不存在，创建一下
      if (serversFolder && !existsSync(serversFolder)) {
        mkdirSync(serversFolder);
      }

      await generateService({
        projectName: pageConfig.name.split('/').pop(),
        ...openAPIConfig,
        serversPath: serversFolder,
        mockFolder,
      });
      api.logger.info('[openAPI]: execution complete');
    },
  });
};
