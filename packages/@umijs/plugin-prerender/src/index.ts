import { IApi } from 'umi-types';
import * as path from 'path';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import { getStaticRoutePaths, getSuffix, nodePolyfill, fixHtmlSuffix, findJSON, injectChunkMaps, patchWindow } from './utils';

type IContextFunc = () => object;

export interface IOpts {
  exclude?: string[];
  // TODO just use seo, not displaym avoid flashing
  visible?: boolean;
  // you mock global, { g_lang: 'zh-CN' } => global.window.g_lang / global.g_lang
  runInMockContext?: object | IContextFunc;
}

export interface IApiPlus extends IApi {
  _: any;
}

export default (api: IApiPlus, opts: IOpts) => {
  const { debug, config, findJS, _, log } = api;
  const { exclude = [], runInMockContext = {} } = opts || {};
  if (!config.ssr) {
    throw new Error('config must use { ssr: true } when using umi preRender plugin');
  }

  api.onPatchRoute(({ route }) => {
    debug(`route before, ${JSON.stringify(route)}`);
    fixHtmlSuffix(route);
    debug(`route after, ${JSON.stringify(route)}`);
  })

  // onBuildSuccess hook
  api.onBuildSuccessAsync(async () => {
    const { routes, paths } = api;
    const { absOutputPath } = paths;
    const { manifestFileName = 'ssr-client-mainifest.json' } = config.ssr as any;
    // mock window
    nodePolyfill(runInMockContext);

    // require serverRender function
    const umiServerFile = findJS(absOutputPath, 'umi.server');
    const manifestFile = findJSON(absOutputPath, manifestFileName)
    if (!umiServerFile) {
      throw new Error(`can't find umi.server.js file`);
    }
    const serverRender = require(umiServerFile);


    const routePaths: string[] = getStaticRoutePaths(_, routes)
      .filter(path => !/(\?|\)|\()/g.test(path));

    // exclude render paths
    const renderPaths = routePaths.filter(path => !exclude.includes(path));
    debug(`renderPaths: ${renderPaths.join(',')}`);
    (log as any).start('umiJS prerender start');
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
      patchWindow({
        location: {
          pathname: url,
          search: '',
        }
      })

      // throw umi.server.js error stack, not catch
      const { ReactDOMServer } = serverRender;
      debug(`react-dom version: ${ReactDOMServer.version}`);
      const { htmlElement, matchPath } = await serverRender.default(ctx);
      let ssrHtml = ReactDOMServer.renderToString(htmlElement);
      try {
        const manifest = require(manifestFile);
        const chunk = manifest[matchPath];
        debug('matchPath', matchPath);
        debug('chunk', chunk);
        if (chunk) {
          ssrHtml = injectChunkMaps(ssrHtml, chunk, config.publicPath || '/')
        }
      } catch (e) {
        log.warn(`${url} reading get chunkMaps failed` ,e);
      }
      const dir = url.substring(0, url.lastIndexOf('/'));
      const filename = getSuffix(url.substring(url.lastIndexOf('/') + 1, url.length));
      try {
        // write html file
        const outputRoutePath = path.join(absOutputPath, dir);
        mkdirp.sync(outputRoutePath);
        fs.writeFileSync(path.join(outputRoutePath, filename), ssrHtml);
        log.complete(`${path.join(dir, filename)}`);
      } catch (e) {
        log.fatal(`${url} render ${filename} failed` ,e);
      }
    }
    log.success('umiJS prerender success!')
  });
};
