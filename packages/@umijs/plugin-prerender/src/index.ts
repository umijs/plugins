import { IApi } from 'umi-types';
import * as path from 'path';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import { getStaticRoutePaths, getSuffix, nodePolyfill } from './utils';

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
  const { debug, config, findJS } = api;
  const { exclude = [], runInMockContext = {} } = opts || {};
  if (!config.ssr) {
    throw new Error('config must use { ssr: true } when using umi preRender plugin');
  }

  // onBuildSuccess hook
  api.onBuildSuccessAsync(async () => {
    const { routes, paths, _, log } = api;
    const { absOutputPath } = paths;
    // mock window
    nodePolyfill(runInMockContext);

    // require serverRender function
    const umiServerFile = findJS(absOutputPath, 'umi.server');
    if (!umiServerFile) {
      throw new Error(`can't find umi.server.js file`);
    }
    const serverRender = require(umiServerFile);


    const routePaths: string[] = getStaticRoutePaths(_, routes)
      // filter (.html)? router
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

      // throw umi.server.js error stack, not catch
      const { ReactDOMServer } = serverRender;
      debug(`react-dom version: ${ReactDOMServer.version}`);
      const { htmlElement } = await serverRender.default(ctx);
      const ssrHtml = ReactDOMServer.renderToString(htmlElement);
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
