import cheerio from 'cheerio';

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
  css.slice(1).forEach(style => {
    $('head').append(`<link rel="stylesheet" href="${publicPath}${style}" />`)
  });

  js.slice(1).forEach(script => {
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
    && route.exact
    && route.path !== '/'
    && !route.routes
    && !isHtmlPath(route.path)
    && !isDynamicRoute(route.path)
    && !route.redirect
  ) {
    route.path = `${route.path}(.html)?`;
  }
}

export const getStaticRoutePaths = (_, routes) => {
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
          memo = memo.concat(getStaticRoutePaths(_, route.routes));
        }
      }
      return memo;
    }, []),
  );
};

export const nodePolyfill = (context) => {
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

export const getSuffix = (filename: string): string => {
  return `${filename || 'index'}.html`;
}
