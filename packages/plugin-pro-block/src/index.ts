// ref:
// - https://umijs.org/plugin/develop.html
import { join } from 'path';
import { existsSync } from 'fs';
import { IApi } from 'umi-types';

const debug = require('debug')('umi-plugin-pro-block');

export interface ProBlockOption {
  moveMock?: boolean;
  moveService?: boolean;
  modifyRequest?: boolean;
  autoAddMenu?: boolean;
}

export default function(api: IApi, opts: ProBlockOption = {}) {
  const { paths, config } = api;

  debug('options', opts);

  let hasUtil, hasService, newFileName;
  api.beforeBlockWriting(({ sourcePath, blockPath }) => {
    const utilsPath = join(paths.absSrcPath, `utils`);
    hasUtil =
      existsSync(join(utilsPath, 'request.js')) || existsSync(join(utilsPath, 'request.ts'));
    hasService = existsSync(join(sourcePath, './src/service.js'));
    newFileName = blockPath.replace(/^\//, '').replace(/\//g, '');
    debug(
      'beforeBlockWriting... hasUtil:',
      hasUtil,
      'hasService:',
      hasService,
      'newFileName:',
      newFileName,
    );
  });

  api._modifyBlockTarget((target, { sourceName }) => {
    if (sourceName === '_mock.js' && opts.moveMock !== false) {
      // src/pages/test/t/_mock.js -> mock/test-t.js
      return join(paths.cwd, 'mock', `${newFileName}.js`);
    }
    if (sourceName === 'service.js' && hasService && opts.moveService !== false) {
      // src/pages/test/t/service.js -> services/test.t.js
      return join(paths.absSrcPath, config.singular ? 'service' : 'services', `${newFileName}.js`);
    }
    return target;
  });

  // umi-request -> @utils/request
  // src/pages/test/t/service.js -> services/test.t.js
  api._modifyBlockFile(content => {
    if (hasUtil && opts.modifyRequest !== false) {
      content = content.replace(
        /[\'\"]umi\-request[\'\"]/g,
        `'@/util${config.singular ? '' : 's'}/request'`,
      );
    }
    if (hasService && opts.moveService !== false) {
      content = content.replace(
        /[\'\"][\.\/]+service[\'\"]/g,
        `'@/service${config.singular ? '' : 's'}/${newFileName}'`,
      );
    }
    return content;
  });

  api._modifyBlockNewRouteConfig(memo => {
    if (opts.autoAddMenu === false) {
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
