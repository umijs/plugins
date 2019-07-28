import cheerio from 'cheerio';
import { JSDOM } from 'jsdom';

export const isDynamicRoute = (path: string): boolean => {
  return path.split('/').some(snippet => snippet.startsWith(':'));
}

interface IChunkMap {
  js: string[];
  css: string[];
}

export const injectChunkMaps = (html: string, chunkMap: IChunkMap, publicPath: string): string => {
  const { js, css } = chunkMap;
  const $ = cheerio.load(html, {
    decodeEntities: false,
    recognizeSelfClosing: true,
  });
  // filter umi.css and umi.*.css, htmlMap have includes
  const styles = css.filter(style => !/^umi\.\w+\.css$/g.test(style)) || [];
  styles.forEach(style => {
    $('head').append(`<link rel="stylesheet" href="${publicPath}${style}" />`)
  });
  // filter umi.js and umi.*.js
  const scripts = js.filter(script => !/^umi([.\w]*)?\.js$/g.test(script)) || [];
  scripts.forEach(script => {
    $('head').append(`<link rel="preload" href="${publicPath}${script}" as="script"/>`)

  })

  return $.html();
}

export const removeSuffixHtml = (path: string): string => {
  return path.replace('?', '')
    .replace('(', '')
    .replace(')', '')
    .replace(/\.(html|htm)/g, '')
}

const isHtmlPath = (path: string): boolean => {
  return /\.(html|htm)/g.test(path);
}

export const findJSON = (baseDir, fileName) => {
  const { join } = require('path');
  const { existsSync } = require('fs');
  const absFilePath = join(baseDir, fileName);
  if (existsSync(absFilePath)) {
    return absFilePath;
  }
}

export const fixHtmlSuffix = (route) => {
  if (route.path
    && route.path !== '/'
    && !isHtmlPath(route.path)
    && !isDynamicRoute(route.path)
    && !route.redirect
  ) {
    route.path = `${route.path}(.html)?`;
  }
}

export const getStaticRoutePaths = (routes) => {
  const _ = global.UMI_LODASH;
  return _.uniq(
    routes.reduce((memo, route) => {
      // filter dynamic Routing like /news/:id, etc.
      if (
        route.path
        && !isDynamicRoute(route.path)
        && !route.redirect
      ) {
        memo.push(removeSuffixHtml(route.path));
        if (route.routes) {
          memo = memo.concat(getStaticRoutePaths(route.routes));
        }
      }
      return memo;
    }, []),
  );
};

export const nodePolyfill = (url, context): any => {
  const _ = global.UMI_LODASH;
  let dom = new JSDOM('<body><div id="root"></div></body>', {
    url: url || 'http://localhost/',
  });

  let params = {};
  if (context) {
    if (typeof context === 'object') {
      params = context;
    } else if (typeof context === 'function') {
      params = context();
    }
  }
  // { window }
  const mockDom = _.defaultsDeep(dom, {
    window: params,
  });

  global.window = mockDom.window;
  global.document = mockDom.window.document;
  global.location = mockDom.window.location;
  global.navigation = mockDom.window.navigation;
  global.Image = mockDom.window.Image;

  // return {
  //   window: {
  //     ...mockDom.window,
  //   },
  //   document: mockDom.window.document,
  //   location: mockDom.window.location,
  //   navigation: mockDom.window.navigation,
  //   Image: mockDom.window.Image,
  // }
};

export const patchWindow = (context) => {
  let params = {};
  if (typeof context === 'object') {
    params = context;
  }
  Object.keys(params).forEach(key => {
    // just mock global.window.bar = '';
    global.window[key] = typeof params[key] === 'object'
      ? {
          ...global.window[key],
          ...params[key],
        }
      : params[key];
    global[key] = global.window[key];
  })
}

export const getSuffix = (filename: string): string => {
  return `${filename || 'index'}.html`;
}
