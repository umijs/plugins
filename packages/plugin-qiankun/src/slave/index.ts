import address from 'address';
import assert from 'assert';
import { isString } from 'lodash';
import { join } from 'path';
import { IApi } from 'umi';
import { addSpecifyPrefixedRoute, defaultSlaveRootId } from '../common';
import { SlaveOptions } from '../types';

const localIpAddress = process.env.USE_REMOTE_IP ? address.ip() : 'localhost';

export default function(api: IApi, options: SlaveOptions) {
  const {
    keepOriginalRoutes = false,
    shouldNotModifyRuntimePublicPath = false,
  } = options || {};
  api.addRuntimePlugin(() => require.resolve('./runtimePlugin'));

  const lifecyclePath = require.resolve('./lifecycles');
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const { name: pkgName } = require(join(api.cwd, 'package.json'));
  api.modifyDefaultConfig(memo => ({
    ...memo,
    disableGlobalVariables: true,
    base: `/${pkgName}`,
    mountElementId: defaultSlaveRootId,
    // 默认开启 runtimePublicPath，避免出现 dynamic import 场景子应用资源地址出问题
    runtimePublicPath: true,
  }));

  if (
    api.service.userConfig.runtimePublicPath !== false &&
    !shouldNotModifyRuntimePublicPath
  ) {
    api.modifyPublicPathStr(
      () =>
        `window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ || "${
          // 开发阶段 publicPath 配置无效，默认为 /
          process.env.NODE_ENV !== 'development'
            ? api.config.publicPath || '/'
            : '/'
        }"`,
    );
  }

  const port = process.env.PORT;
  const protocol = process.env.HTTPS ? 'https' : 'http';

  api.chainWebpack(config => {
    assert(api.pkg.name, 'You should have name in package.json');
    config.output
      .libraryTarget('umd')
      .library(`${api.pkg.name}-[name]`)
      .jsonpFunction(`webpackJsonp_${api.pkg.name}`);
    return config;
  });

  // umi bundle 添加 entry 标记
  api.modifyHTML($ => {
    $('script').each((_, el) => {
      const scriptEl = $(el);
      const umiEntryJs = /\/?umi(\.\w+)?\.js$/g;
      if (umiEntryJs.test(scriptEl.attr('src') ?? '')) {
        scriptEl.attr('entry', '');
      }
    });

    return $;
  });

  // source-map 跨域设置
  if (process.env.NODE_ENV === 'development' && port) {
    // 变更 webpack-dev-server websocket 默认监听地址
    process.env.SOCKET_SERVER = `${protocol}://${localIpAddress}:${port}/`;
    api.chainWebpack((memo, { webpack }) => {
      // 禁用 devtool，启用 SourceMapDevToolPlugin
      memo.devtool(false);
      memo.plugin('source-map').use(webpack.SourceMapDevToolPlugin, [
        {
          // @ts-ignore
          namespace: pkgName,
          append: `\n//# sourceMappingURL=${protocol}://${localIpAddress}:${port}/[url]`,
          filename: '[file].map',
        },
      ]);
      return memo;
    });
  }

  api.onGenerateFiles(() => {
    api.writeTmpFile({
      path: 'plugin-qiankun/qiankunContext.js',
      content: `
      import { createContext, useContext } from 'react';

      export const Context = createContext(null);
      export function useRootExports() {
        return useContext(Context);
      };`.trim(),
    });
  });

  api.addUmiExports(() => [
    {
      specifiers: ['useRootExports'],
      source: '../plugin-qiankun/qiankunContext',
    },
  ]);

  api.addEntryImports(() => {
    return {
      source: lifecyclePath,
      specifier:
        '{ genMount as qiankun_genMount, genBootstrap as qiankun_genBootstrap, genUnmount as qiankun_genUnmount }',
    };
  });
  api.addEntryCode(
    () =>
      `
    export const bootstrap = qiankun_genBootstrap(clientRender);
    export const mount = qiankun_genMount();
    export const unmount = qiankun_genUnmount('${api.config.mountElementId}');

    if (!window.__POWERED_BY_QIANKUN__) {
      bootstrap().then(mount);
    }
    `,
  );

  api.modifyRoutes(routes => {
    // 开启keepOriginalRoutes配置
    if (keepOriginalRoutes === true || isString(keepOriginalRoutes)) {
      return addSpecifyPrefixedRoute(routes, keepOriginalRoutes, pkgName);
    }

    return routes;
  });
}
