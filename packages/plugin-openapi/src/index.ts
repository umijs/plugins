import { join } from 'path';
import { IApi } from 'umi';
import rimraf from 'rimraf';
import serveStatic from 'serve-static';
import { generateService, getSchema } from '@umijs/openapi';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

export default (api: IApi) => {
  api.describe({
    key: 'openAPI',
    config: {
      schema(joi) {
        return joi.object({
          requestLibPath: joi.string(),
          schemaPath: joi.string(),
          mock: joi.boolean(),
          projectName: joi.string(),
        });
      },
    },
    enableBy: api.EnableBy.config,
  });
  const { absNodeModulesPath, absTmpPath } = api.paths;
  const openAPIFilesPath = join(absNodeModulesPath!, 'umi_open_api');

  try {
    if (existsSync(openAPIFilesPath)) {
      rimraf.sync(openAPIFilesPath);
    }
    mkdirSync(join(openAPIFilesPath));
  } catch (error) {
    // console.log(error);
  }

  // 增加中间件
  api.addMiddewares(() => {
    return serveStatic(openAPIFilesPath);
  });

  api.onGenerateFiles(() => {
    api.writeTmpFile({
      path: join('plugin-openapi', 'openapi.tsx'),
      content: `
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { Card } from 'antd';
      
const App = () => (
  <Card>
    <SwaggerUI url="/umi-plugins_openapi.json" />
  </Card>
);
export default App;
      `,
    });
  });

  if (api.env === 'development') {
    api.modifyRoutes((routes) => {
      return [
        {
          path: 'umi/plugin/openapi',
          component: join(absTmpPath!, 'plugin-openapi', 'openapi.tsx'),
        },
        ...routes,
      ];
    });
  }

  api.onDevCompileDone(async () => {
    try {
      const openAPIConfig = api.config.openAPI;
      const openAPIJson = getSchema(openAPIConfig.schemaPath);
      writeFileSync(
        join(openAPIFilesPath, 'umi-plugins_openapi.json'),
        JSON.stringify(openAPIJson, null, 2),
      );
    } catch (error) {
      console.error(error);
    }
  });

  api.registerCommand({
    name: 'openapi',
    fn: async () => {
      const openAPIConfig = api.config.openAPI;
      const pageConfig = require(join(api.cwd, 'package.json'));
      const mockFolder = openAPIConfig.mock ? join(api.cwd, 'mock') : undefined;
      const serversFolder = join(api.cwd, 'src', 'services');
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
