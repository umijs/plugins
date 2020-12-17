import address from 'address';
import assert from 'assert';
import { isString, isEqual } from 'lodash';
import { join } from 'path';
import { IApi } from 'umi';
import { SlaveOptions } from '../types';
import { addSpecifyPrefixedRoute } from './addSpecifyPrefixedRoute';
import {
  defaultSlaveRootId,
  qiankunStateFromMasterModelNamespace,
} from '../constants';
import { readFileSync } from 'fs';

export function isSlaveEnable(api: IApi) {
  return (
    !!api.userConfig?.qiankun?.slave ||
    isEqual(api.userConfig?.qiankun, {}) ||
    !!process.env.INITIAL_QIANKUN_SLAVE_OPTIONS
  );
}

export default function(api: IApi) {
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
  api.modifyDefaultConfig(memo => {
    const initialSlaveOptions: SlaveOptions = {
      ...JSON.parse(process.env.INITIAL_QIANKUN_SLAVE_OPTIONS || '{}'),
      ...(memo.qiankun || {}).slave,
    };

    const modifiedDefaultConfig = {
      ...memo,
      disableGlobalVariables: true,
      mountElementId: defaultSlaveRootId,
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

  api.modifyPublicPathStr(publicPathStr => {
    const { runtimePublicPath } = api.config;
    const { shouldNotModifyRuntimePublicPath } = (
      api.config.qiankun || {}
    ).slave!;

    if (runtimePublicPath === true && !shouldNotModifyRuntimePublicPath) {
      return `window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ || "${api.config
        .publicPath || '/'}"`;
    }

    return publicPathStr;
  });

  api.chainWebpack((config, { webpack }) => {
    assert(api.pkg.name, 'You should have name in package.json');

    config.output.libraryTarget('umd').library(`${api.pkg.name}-[name]`);
    const usingWebpack5 = webpack.version?.startsWith('5');
    // webpack5 移除了 jsonpFunction 配置，且不再需要配置 jsonpFunction，see https://webpack.js.org/blog/2020-10-10-webpack-5-release/#automatic-unique-naming
    if (!usingWebpack5) {
      config.output.jsonpFunction(`webpackJsonp_${api.pkg.name}`);
    }

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

  const port = process.env.PORT;
  // source-map 跨域设置
  if (process.env.NODE_ENV === 'development' && port) {
    const localHostname = process.env.USE_REMOTE_IP
      ? address.ip()
      : process.env.HOST || 'localhost';

    const protocol = process.env.HTTPS ? 'https' : 'http';
    // 变更 webpack-dev-server websocket 默认监听地址
    process.env.SOCKET_SERVER = `${protocol}://${localHostname}:${port}/`;
    api.chainWebpack((memo, { webpack }) => {
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
      return memo;
    });
  }

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

  useLegacyMode(api);
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
            '[@umijs/plugin-qiankun] Deprecated: useRootExports 通信方式不再推荐，建议您升级到新的应用通信模式，以获得更好的开发体验。详见 https://umijs.org/plugins/plugin-qiankun#%E7%88%B6%E5%AD%90%E5%BA%94%E7%94%A8%E9%80%9A%E8%AE%AF',
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

  api.modifyRoutes(routes => {
    // 开启keepOriginalRoutes配置
    if (keepOriginalRoutes === true || isString(keepOriginalRoutes)) {
      return addSpecifyPrefixedRoute(routes, keepOriginalRoutes, api.pkg.name);
    }

    return routes;
  });
}
