// ref:
// - https://umijs.org/plugin/develop.html
import { join } from 'path';
import { existsSync } from 'fs';
import { IApi } from 'umi';

export default function(api: IApi) {
  const { paths, config, logger } = api;

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
  api.beforeBlockWriting(({ sourcePath, blockPath }) => {
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
  });

  api._modifyBlockTarget((target, { sourceName }) => {
    const { proBlock = {} } = api.config;
    if (sourceName === '_mock.js' && proBlock.moveMock !== false && paths.cwd) {
      // src/pages/test/t/_mock.js -> mock/test-t.js
      return join(paths.cwd, 'mock', `${newFileName}.js`);
    }
    if (
      sourceName === 'service.js' &&
      hasService &&
      proBlock.moveService !== false &&
      paths.absSrcPath
    ) {
      // src/pages/test/t/service.js -> services/test.t.js
      return join(
        paths.absSrcPath,
        config.singular ? 'service' : 'services',
        `${newFileName}.js`,
      );
    }
    return target;
  });

  // umi-request -> @utils/request
  // src/pages/test/t/service.js -> services/test.t.js
  api._modifyBlockFile(content => {
    const { proBlock = {} } = api.config;
    if (hasUtil && proBlock.modifyRequest !== false) {
      content = content.replace(
        /[\'\"]umi\-request[\'\"]/g,
        `'@/util${config.singular ? '' : 's'}/request'`,
      );
    }
    if (hasService && proBlock.moveService !== false) {
      content = content.replace(
        /[\'\"][\.\/]+service[\'\"]/g,
        `'@/service${config.singular ? '' : 's'}/${newFileName}'`,
      );
    }
    return content;
  });

  api._modifyBlockNewRouteConfig(memo => {
    const { proBlock = {} } = api.config;
    if (proBlock.autoAddMenu === false) {
      return memo;
    }
    const icon = memo.path.indexOf('/') === 0 ? 'smile' : undefined;
    return {
      name: memo.name || memo.path.split('/').pop(),
      icon,
      ...memo,
    };
  });
}
