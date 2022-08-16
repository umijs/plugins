import address from 'address';
import assert from 'assert';
import { readFileSync } from 'fs';
import { isEqual, isString } from 'lodash';
import { join } from 'path';
import { IApi } from 'umi';
import { qiankunStateFromMasterModelNamespace } from '../constants';
import { SlaveOptions } from '../types';
import { addSpecifyPrefixedRoute } from './addSpecifyPrefixedRoute';
import { NextFunction, Request, Response } from '@umijs/types';
import { createProxyMiddleware } from '@umijs/server';
import { responseInterceptor } from 'http-proxy-middleware'; // beta版本注：由于目前 @umijs/server 没有导出 responseInterceptor 函数，所以这里只是临时导入作为 beta 版本测试，实际上线后需要修改 umi 的导出，而非再次引入 http-proxy-middleware

export function isSlaveEnable(api: IApi) {
  const slaveCfg = api.userConfig?.qiankun?.slave;
  if (slaveCfg) {
    return slaveCfg.enable !== false;
  }

  // 兼容早期配置， qiankun 配一个空，相当于开启 slave
  if (isEqual(api.userConfig?.qiankun, {})) {
    return true;
  }

  return !!process.env.INITIAL_QIANKUN_SLAVE_OPTIONS;
}

export default function (api: IApi) {
  api.describe({
    enableBy: () => isSlaveEnable(api),
  });

  api.addRuntimePlugin(() => '@@/plugin-qiankun/slaveRuntimePlugin');

  api.register({
    key: 'addExtraModels',
    fn: () => [
      {
        absPath: '@@/plugin-qiankun/qiankunModel',
        namespace: qiankunStateFromMasterModelNamespace,
      },
    ],
  });

  // eslint-disable-next-line import/no-dynamic-require, global-require
  api.modifyDefaultConfig((memo) => {
    const initialSlaveOptions: SlaveOptions = {
      devSourceMap: true,
      ...JSON.parse(process.env.INITIAL_QIANKUN_SLAVE_OPTIONS || '{}'),
      ...(memo.qiankun || {}).slave,
    };

    const modifiedDefaultConfig = {
      ...memo,
      disableGlobalVariables: true,
      // 默认开启 runtimePublicPath，避免出现 dynamic import 场景子应用资源地址出问题
      runtimePublicPath: true,
      runtimeHistory: {},
      qiankun: {
        ...memo.qiankun,
        slave: initialSlaveOptions,
      },
    };

    const shouldNotModifyDefaultBase =
      api.userConfig.qiankun?.slave?.shouldNotModifyDefaultBase ??
      initialSlaveOptions.shouldNotModifyDefaultBase;
    if (!shouldNotModifyDefaultBase) {
      modifiedDefaultConfig.base = `/${api.pkg.name}`;
    }

    return modifiedDefaultConfig;
  });

  api.modifyConfig((config) => {
    // mfsu 场景默认给子应用增加 mfName 配置，从而避免冲突
    if (config.mfsu && !config.mfsu.mfName) {
      // 替换掉包名里的特殊字符
      config.mfsu.mfName = `mf_${api.pkg.name
        ?.replace(/^@/, '')
        .replace(/\W/g, '_')}`;
    }

    return config;
  });

  api.modifyPublicPathStr((publicPathStr) => {
    const { runtimePublicPath } = api.config;
    const { shouldNotModifyRuntimePublicPath } = (api.config.qiankun || {})
      .slave!;

    if (runtimePublicPath === true && !shouldNotModifyRuntimePublicPath) {
      return `window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ || "${
        api.config.publicPath || '/'
      }"`;
    }

    return publicPathStr;
  });

  api.chainWebpack((config, { webpack }) => {
    assert(api.pkg.name, 'You should have name in package.json');

    const { shouldNotAddLibraryChunkName } = (api.config.qiankun || {}).slave!;

    config.output
      .libraryTarget('umd')
      .library(
        shouldNotAddLibraryChunkName ? api.pkg.name : `${api.pkg.name}-[name]`,
      );

    const usingWebpack5 = webpack.version?.startsWith('5');
    // webpack5 移除了 jsonpFunction 配置，且不再需要配置 jsonpFunction，see https://webpack.js.org/blog/2020-10-10-webpack-5-release/#automatic-unique-naming
    if (!usingWebpack5) {
      config.output.jsonpFunction(`webpackJsonp_${api.pkg.name}`);
    }

    return config;
  });

  // umi bundle 添加 entry 标记
  api.modifyHTML(($) => {
    $('script').each((_: any, el: any) => {
      const scriptEl = $(el);
      const umiEntryJs = /\/?umi(\.\w+)?\.js$/g;
      if (umiEntryJs.test(scriptEl.attr('src') ?? '')) {
        scriptEl.attr('entry', '');
      }
    });

    return $;
  });

  api.chainWebpack((memo, { webpack }) => {
    const port = process.env.PORT;
    // source-map 跨域设置
    if (api.env === 'development' && port) {
      const localHostname = process.env.USE_REMOTE_IP
        ? address.ip()
        : process.env.HOST || 'localhost';

      const protocol = process.env.HTTPS ? 'https' : 'http';
      // 变更 webpack-dev-server websocket 默认监听地址
      process.env.SOCKET_SERVER = `${protocol}://${localHostname}:${port}/`;

      // 开启了 devSourceMap 配置，默认为 true
      if (api.config.qiankun && api.config.qiankun.slave!.devSourceMap) {
        // 禁用 devtool，启用 SourceMapDevToolPlugin
        memo.devtool(false);
        memo.plugin('source-map').use(webpack.SourceMapDevToolPlugin, [
          {
            // @ts-ignore
            namespace: api.pkg.name,
            append: `\n//# sourceMappingURL=${protocol}://${localHostname}:${port}/[url]`,
            filename: '[file].map',
          },
        ]);
      }
    }

    return memo;
  });

  api.addEntryImports(() => {
    return {
      source: '@@/plugin-qiankun/lifecycles',
      specifier:
        '{ genMount as qiankun_genMount, genBootstrap as qiankun_genBootstrap, genUnmount as qiankun_genUnmount, genUpdate as qiankun_genUpdate }',
    };
  });
  api.addEntryCode(
    () =>
      `
    export const bootstrap = qiankun_genBootstrap(clientRender);
    export const mount = qiankun_genMount('${api.config.mountElementId}');
    export const unmount = qiankun_genUnmount('${api.config.mountElementId}');
    export const update = qiankun_genUpdate();

    if (!window.__POWERED_BY_QIANKUN__) {
      bootstrap().then(mount);
    }
    `,
  );

  api.onGenerateFiles(() => {
    api.writeTmpFile({
      path: 'plugin-qiankun/slaveOptions.js',
      content: `
      let options = ${JSON.stringify((api.config.qiankun || {}).slave || {})};
      export const getSlaveOptions = () => options;
      export const setSlaveOptions = (newOpts) => options = ({ ...options, ...newOpts });
      `,
    });

    api.writeTmpFile({
      path: 'plugin-qiankun/qiankunModel.ts',
      content: readFileSync(join(__dirname, 'qiankunModel.ts.tpl'), 'utf-8'),
    });

    api.writeTmpFile({
      path: 'plugin-qiankun/connectMaster.tsx',
      content: readFileSync(join(__dirname, 'connectMaster.tsx.tpl'), 'utf-8'),
    });

    api.writeTmpFile({
      path: 'plugin-qiankun/slaveRuntimePlugin.ts',
      content: readFileSync(
        join(__dirname, 'slaveRuntimePlugin.ts.tpl'),
        'utf-8',
      ),
    });

    api.writeTmpFile({
      path: 'plugin-qiankun/lifecycles.ts',
      content: readFileSync(join(__dirname, 'lifecycles.ts.tpl'), 'utf-8'),
    });
  });

  api.addMiddlewares(async () => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const masterEntry =
        api.config.qiankun && api.config.qiankun.slave?.masterEntry;

      const { proxyToMasterEnabled } = ((await api.applyPlugins({
        key: 'shouldProxyToMaster',
        type: api.ApplyPluginsType.modify,
        initialValue: { proxyToMasterEnabled: true, req },
      })) ?? {}) as {
        req?: Request;
        proxyToMasterEnabled?: boolean;
      };

      if (masterEntry && proxyToMasterEnabled) {
        const appName = api.pkg.name;
        assert(
          appName,
          '[@umijs/plugin-qiankun]: You should have name in package.json',
        );

        return createProxyMiddleware(
          (pathname) => pathname !== '/local-dev-server',
          {
            target: masterEntry,
            secure: false,
            ignorePath: false,
            followRedirects: false,
            changeOrigin: true,
            selfHandleResponse: true,
            onProxyRes: responseInterceptor(
              async (responseBuffer, proxyRes, req, res) => {
                if (proxyRes.statusCode === 302) {
                  const hostname = (req as Request).hostname;
                  const port = api.getPort();
                  const goto = `${hostname}:${port}`;
                  const redirectUrl =
                    proxyRes.headers.location!.replace(
                      encodeURIComponent(new URL(masterEntry).hostname),
                      encodeURIComponent(goto),
                    ) || masterEntry;

                  const redirectMessage = `[@umijs/plugin-qiankun]: redirect to ${redirectUrl}`;

                  api.logger.info(redirectMessage);
                  res.statusCode = 302;
                  res.setHeader('location', redirectUrl);
                  return redirectMessage;
                }

                const originalHtml = responseBuffer.toString('utf8');
                const microAppEntry = getCurrentLocalDevServerEntry(api, req);

                let html = originalHtml.replace(
                  '<head>',
                  `<head><script type="extra-qiankun-config">${JSON.stringify({
                    master: {
                      apps: [
                        {
                          name: appName,
                          entry: microAppEntry,
                          extraSource: microAppEntry,
                        },
                      ],
                      routes: [
                        {
                          microApp: appName,
                          name: appName,
                          path: '/' + appName,
                          extraSource: microAppEntry,
                        },
                      ],
                      prefetch: false,
                    },
                  })}</script>`,
                );

                html = await api.applyPlugins({
                  key: 'modifyMasterHTML',
                  type: api.ApplyPluginsType.modify,
                  initialValue: html,
                });

                return html;
              },
            ),
            onError(err, _, res) {
              api.logger.error(err);
              res.set('content-type', 'text/plain; charset=UTF-8');
              res.end(
                `[@umijs/plugin-qiankun] 代理到 ${masterEntry} 时出错了，请尝试 ${masterEntry} 是否是可以正常访问的，然后重新启动项目试试。(注意如果出现跨域问题，请修改本地 host ，通过一个和主应用相同的一级域名的域名来访问 127.0.0.1)`,
              );
            },
          },
        )(req, res, next);
      }

      return next();
    };
  });

  useLegacyMode(api);
}

function getCurrentLocalDevServerEntry(api: IApi, req: Request): string {
  const port = api.getPort();
  const hostname = req.hostname;
  const protocol = req.protocol;
  return `${protocol}://${hostname}${port ? ':' : ''}${port}/local-dev-server`;
}

function useLegacyMode(api: IApi) {
  const options: SlaveOptions = api.userConfig?.qiankun?.slave!;
  const { keepOriginalRoutes = false } = options || {};

  api.onGenerateFiles(() => {
    api.writeTmpFile({
      path: 'plugin-qiankun/qiankunContext.js',
      content: `
      import { createContext, useContext } from 'react';

      export const Context = createContext(null);
      export function useRootExports() {
        if (process.env.NODE_ENV === 'development') {
          console.error(
            '[@umijs/plugin-qiankun] Deprecated: useRootExports 通信方式不再推荐，并将在后续版本中移除，请尽快升级到新的应用通信模式，以获得更好的开发体验。详见 https://umijs.org/plugins/plugin-qiankun#%E7%88%B6%E5%AD%90%E5%BA%94%E7%94%A8%E9%80%9A%E8%AE%AF',
          );
        }
        return useContext(Context);
      }`.trim(),
    });
  });

  api.addUmiExports(() => [
    {
      specifiers: ['useRootExports'],
      source: '../plugin-qiankun/qiankunContext',
    },
    {
      specifiers: ['connectMaster'],
      source: '../plugin-qiankun/connectMaster',
    },
  ]);

  api.modifyRoutes((routes) => {
    // 开启keepOriginalRoutes配置
    if (keepOriginalRoutes === true || isString(keepOriginalRoutes)) {
      return addSpecifyPrefixedRoute(routes, keepOriginalRoutes, api.pkg.name);
    }

    return routes;
  });
}
