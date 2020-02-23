// ref:
// - https://umijs.org/plugin/develop.html
import { join } from 'path';
import { existsSync } from 'fs';
import { IApi } from 'umi';

export default function(api: IApi) {
  const { paths, logger } = api;

  if (!api.hasPlugins(['@umijs/plugin-blocks'])) {
    logger.error(
      `plugin @umijs/plugin-blocks is required for @umijs/plugin-pro-block.`,
    );
    return;
  }

  api.describe({
    key: 'proBlock',
    config: {
      schema(joi) {
        return joi.object({
          moveMock: joi.boolean(),
          moveService: joi.boolean(),
          modifyRequest: joi.boolean(),
          autoAddMenu: joi.boolean(),
        });
      },
    },
  });

  let hasUtil: boolean, hasService: boolean, newFileName: string;
  api.register({
    key: 'beforeBlockWriting',
    fn: ({
      sourcePath,
      blockPath,
    }: {
      sourcePath: string;
      blockPath: string;
    }) => {
      const utilsPath = join(paths.absSrcPath || '', `utils`);
      hasUtil =
        existsSync(join(utilsPath, 'request.js')) ||
        existsSync(join(utilsPath, 'request.ts'));
      hasService = existsSync(join(sourcePath, './src/service.js'));
      newFileName = blockPath.replace(/^\//, '').replace(/\//g, '');
      logger.debug(
        'beforeBlockWriting... hasUtil:',
        hasUtil,
        'hasService:',
        hasService,
        'newFileName:',
        newFileName,
      );
    },
  });

  api.register({
    key: '_modifyBlockTarget',
    fn: (target: string, { sourceName }: { sourceName: string }) => {
      const { proBlock = {} } = api.config;
      if (sourceName === '_mock.js' && proBlock.moveMock && paths.cwd) {
        // src/pages/test/t/_mock.js -> mock/test-t.js
        return join(paths.cwd, 'mock', `${newFileName}.js`);
      }
      if (
        sourceName === 'service.js' &&
        hasService &&
        proBlock.moveService &&
        paths.absSrcPath
      ) {
        // src/pages/test/t/service.js -> services/test.t.js
        return join(
          paths.absSrcPath,
          api.config.singular ? 'service' : 'services',
          `${newFileName}.js`,
        );
      }
      return target;
    },
  });

  // umi-request -> @utils/request
  // src/pages/test/t/service.js -> services/test.t.js
  api.register({
    key: '_modifyBlockFile',
    fn: (content: string) => {
      const { proBlock = {} } = api.config;
      if (hasUtil && proBlock.modifyRequest) {
        content = content.replace(
          /[\'\"]umi\-request[\'\"]/g,
          `'@/util${api.config.singular ? '' : 's'}/request'`,
        );
      }
      if (hasService && proBlock.moveService) {
        content = content.replace(
          /[\'\"][\.\/]+service[\'\"]/g,
          `'@/service${api.config.singular ? '' : 's'}/${newFileName}'`,
        );
      }
      return content;
    },
  });

  api.register({
    key: '_modifyBlockNewRouteConfig',
    fn: (memo: any) => {
      const { proBlock = {} } = api.config;
      if (proBlock.autoAddMenu) {
        return memo;
      }
      const icon = memo.path.indexOf('/') === 0 ? 'smile' : undefined;
      return {
        name: memo.name || memo.path.split('/').pop(),
        icon,
        ...memo,
      };
    },
  });
}
