/**
 * 通过路由配置自动生成布局配置
 */
import { IBestAFSRoute, IRouteLayoutConfig } from '../types/interface.d';

type LayoutConfig = {
  [path: string]: IRouteLayoutConfig;
};

const defaultLayoutConfig = {
  hideMenu: false,
  hideNav: false,
  hideFooter: false,
};

/*
 * 计算当前路由的最终 layout 配置
 * - 继承父路由的 layout 配置
 * - 但子路由的 layout 配置优先级更高
 */

function calcExecLayoutConfig(
  parentRouteLayoutConfig: IRouteLayoutConfig,
  layout: IBestAFSRoute['layout'],
) {
  const execConfig = {};
  for (let configItem in parentRouteLayoutConfig) {
    let execConfigItem = parentRouteLayoutConfig[configItem];
    switch (layout) {
      case undefined:
        execConfig[configItem] = execConfigItem;
        break;
      case true:
        execConfig[configItem] = false;
        break;
      case false:
        execConfig[configItem] = true;
        break;
      default:
        execConfig[configItem] =
          layout[configItem] === undefined
            ? execConfigItem
            : layout[configItem];
    }
  }
  return execConfig;
}

/**
 * @param routes
 */
function formatter(
  routes: IBestAFSRoute[] = [],
  prefix: string = '',
  base: string = '/',
  parentRouteLayoutConfig: IRouteLayoutConfig = defaultLayoutConfig,
  LayoutConfig: LayoutConfig = {},
): LayoutConfig {
  routes
    .filter(item => item && !item.path?.startsWith('http'))
    .map(route => {
      const { layout, indexRoute, path = '', routes, unaccessible } = route;

      const execLayoutConfig = calcExecLayoutConfig(
        parentRouteLayoutConfig,
        layout,
      );

      // 拼接 path
      const absolutePath = path.startsWith('/')
        ? path
        : `${base}${base === '/' ? '' : '/'}${path}`;

      LayoutConfig[`${prefix}${absolutePath}`] = {
        ...execLayoutConfig,
        unAccessible: unaccessible || false,
      };

      // 拼接 childrenRoutes, 处理存在 indexRoute 时的逻辑
      const childrenRoutes = indexRoute
        ? [
            {
              path,
              layout,
              ...indexRoute,
            },
          ].concat(routes || [])
        : routes;

      // 拼接返回的 layout 数据
      if (childrenRoutes && childrenRoutes.length) {
        const result = formatter(
          childrenRoutes,
          prefix,
          absolutePath,
          execLayoutConfig,
          LayoutConfig,
        );
        LayoutConfig = { ...LayoutConfig, ...result };
      }
    });
  return LayoutConfig;
}

export default formatter;
