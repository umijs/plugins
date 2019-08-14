import { IApi } from 'umi-types';
import * as path from 'path';
import * as fs from 'fs';
import { getCode } from 'react-ssr-checksum';
import * as mkdirp from 'mkdirp';
import { getStaticRoutePaths, getSuffix, nodePolyfill, fixHtmlSuffix, findJSON, injectChunkMaps, _getDocumentHandler } from './utils';

type IContextFunc = () => object;

export interface IOpts {
  exclude?: string[];
  /** disable ssr BOM polyfill */
  disablePolyfill?: boolean;
  // TODO just use seo, not displaym avoid flashing
  visible?: boolean;
  // you mock global, { g_lang: 'zh-CN' } => global.window.g_lang / global.g_lang
  runInMockContext?: object | IContextFunc;
  // use renderToStaticMarkup
  staticMarkup?: boolean;
  // htmlSuffix
  htmlSuffix?: boolean;
  // checkSum, default: false
  checkSum?: boolean;
  // modify render html function
  postProcessHtml?: ($: CheerioStatic, path: string) => CheerioStatic;
}

export default (api: IApi, opts: IOpts) => {
  const { debug, config, findJS, _, log, paths } = api;
  global.UMI_LODASH = _;
  const {
    exclude = [],
    runInMockContext = {},
    staticMarkup = false,
    htmlSuffix = false,
    disablePolyfill = false,
    checkSum = false,
    postProcessHtml,
  } = opts || {};
  if (!config.ssr) {
    throw new Error('config must use { ssr: true } when using umi preRender plugin');
  }

  api.onPatchRoute(({ route }) => {
    debug(`route before, ${JSON.stringify(route)}`);
    if (htmlSuffix) {
      fixHtmlSuffix(route);
    }
    debug(`route after, ${JSON.stringify(route)}`);
  })

  if (checkSum) {
    api.addRendererWrapperWithComponent(() => {
      const modulePath = path.join(paths.absTmpDirPath, './CheckSum.js');
      fs.writeFileSync(
        modulePath,
        `import CheckSum from 'react-ssr-checksum';
          export default (props) => (
            <CheckSum checksumCode={window.UMI_PRERENDER_SUM_CODE}>{props.children}</CheckSum>
          )`
      )
      return modulePath;
    });
  }

  // onBuildSuccess hook
  api.onBuildSuccessAsync(async () => {
    const { routes, paths } = api;
    const { absOutputPath } = paths;
    const { manifestFileName = 'ssr-client-mainifest.json' } = config.ssr as any;


    // require serverRender function
    const umiServerFile = findJS(absOutputPath, 'umi.server');
    const manifestFile = findJSON(absOutputPath, manifestFileName)
    if (!umiServerFile) {
      throw new Error(`can't find umi.server.js file`);
    }
    // mock window
    nodePolyfill('http://localhost', runInMockContext, disablePolyfill);
    const serverRender = require(umiServerFile);

    const routePaths: string[] = getStaticRoutePaths( routes)
      .filter(path => !/(\?|\)|\()/g.test(path));

    // exclude render paths
    const renderPaths = routePaths.filter(path => !exclude.includes(path));
    debug(`renderPaths: ${renderPaths.join(',')}`);
    log.start('umiJS prerender start');
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
      // init window BOM
      nodePolyfill(`http://localhost${url}`, runInMockContext, disablePolyfill);
      // throw umi.server.js error stack, not catch
      const { ReactDOMServer } = serverRender;
      debug(`react-dom version: ${ReactDOMServer.version}`);
      const { htmlElement, matchPath } = await serverRender.default(ctx);
      let ssrHtml = ReactDOMServer[staticMarkup ? 'renderToStaticMarkup' : 'renderToString'](htmlElement);

      if (checkSum) {
        try {
          const hashCode = getCode(ssrHtml);
          debug(`hashCode: ${hashCode}`);

          ssrHtml = ssrHtml.replace('</head>', `<script>window.UMI_PRERENDER_SUM_CODE = "${hashCode}";</script></head>`);
        } catch (e) {
          log.warn('getHashCode error', e);
        }
      }


      if (postProcessHtml) {
        try {
          const $ = _getDocumentHandler(ssrHtml);
          // avoid user not return $
          ssrHtml = (postProcessHtml($, url) || $).html();
          debug(`ssrHtml: ${ssrHtml}`);
        } catch (e) {
          log.warn(`${url} postProcessHtml` ,e);
        }
      }

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
        fs.writeFileSync(path.join(outputRoutePath, filename), `<!DOCTYPE html>${ssrHtml}`);
        log.complete(`${path.join(dir, filename)}`);
      } catch (e) {
        log.fatal(`${url} render ${filename} failed` ,e);
      }
    }
    log.success('umiJS prerender success!');
  });
};
