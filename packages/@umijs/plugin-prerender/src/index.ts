import { IApi } from 'umi-types';
import * as path from 'path';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';

// for test
export const getStaticRoutePaths = (_, routes) => {
  return _.uniq(
    routes.reduce((memo, route) => {
      // filter dynamic Routing like /news/:id, etc.
      if (route.path && route.path.indexOf(':') === -1) {
        memo.push(route.path);
        if (route.routes) {
          memo = memo.concat(getStaticRoutePaths(_, route.routes));
        }
      }
      return memo;
    }, []),
  );
};

type IContextFunc = () => object;

export interface IOpts {
  exclude?: string[];
  // TODO just use seo, not displaym avoid flashing
  visible?: boolean;
  // you mock global, { g_lang: 'zh-CN' } => global.window.g_lang / global.g_lang
  runInMockContext?: object | IContextFunc;
}

const nodePolyfill = (context) => {
  (global as any).window = {};
  (global as any).self = window;
  (global as any).document = window.document;
  (global as any).navigator = window.navigator;
  (global as any).localStorage = window.localStorage;
  if (context) {
    let params = {};
    if (typeof context === 'object') {
      params = context;
    } else if (typeof context === 'function') {
      params = context();
    }
    Object.keys(params).forEach(key => {
      // just mock global.window.bar = '';
      (global as any).window[key] = params[key];
      global[key] = params[key];
    })
  }
};

export default (api: IApi, opts: IOpts) => {
  const { debug, config, findJS } = api;
  const { exclude = [], runInMockContext = {} } = opts || {};
  if (!(config as any).ssr) {
    throw new Error('config must use { ssr: true } when using umi preRender plugin');
  }

  // onBuildSuccess hook
  api.onBuildSuccessAsync(async () => {
    const { routes, paths, _ } = api as any;
    const { absOutputPath } = paths;
    // mock window
    nodePolyfill(runInMockContext);

    // require serverRender function
    const umiServerFile = findJS(absOutputPath, 'umi.server');
    if (!umiServerFile) {
      throw new Error(`can't find umi.server.js file`);
    }
    const serverRender = require(umiServerFile);

    const routePaths: string[] = getStaticRoutePaths(_, routes);

    // exclude render paths
    const renderPaths = routePaths.filter(path => !exclude.includes(path));
    debug(`renderPaths: ${renderPaths.join(',')}`);
    // loop routes
    for (const url of renderPaths) {
      const ctx = {
        url,
        req: {
          url,
        },
        request: {
          url,
        },
      };
      // throw umi.server.js error stack, not catch
      const { ReactDOMServer } = serverRender;
      debug(`react-dom version: ${ReactDOMServer.version}`);
      const { htmlElement } = await serverRender.default(ctx);
      const ssrHtml = ReactDOMServer.renderToString(htmlElement);
      // write html file
      const outputRoutePath = path.join(absOutputPath, url);
      mkdirp.sync(outputRoutePath);
      fs.writeFileSync(path.join(outputRoutePath, 'index.html'), ssrHtml);
    }
  });
};
