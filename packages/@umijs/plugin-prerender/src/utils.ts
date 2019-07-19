export const isDynamicRoute = (path: string): boolean => {
  return path.split('/').some(snippet => snippet.startsWith(':'));
}

export const getStaticRoutePaths = (_, routes) => {
  return _.uniq(
    routes.reduce((memo, route) => {
      // filter dynamic Routing like /news/:id, etc.
      if (route.path && !isDynamicRoute(route.path)) {
        memo.push(route.path);
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
  return /\.(htm|html)$/g.test(filename) ? filename : `${filename || 'index'}.html`;
}
