/**
 * 通过路由配置自动生成布局配置
 */
import memoizeOne from 'memoize-one';
import { isEqual } from 'lodash';
import { IBestAFSRoute, IRouteLayoutConfig } from '../types/interface.d';

type LayoutConfig = {
  [path: string]: IRouteLayoutConfig;
};

const defaultLayoutConfig = {
  hideMenu: false,
  hideNav: false,
};

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

      // 继承父路由的 layout 配置
      let hideNav = parentRouteLayoutConfig.hideNav;
      let hideMenu = parentRouteLayoutConfig.hideMenu;

      // 子路由的 layout 配置 优先级更高

      switch (layout) {
        case undefined:
          hideMenu = hideMenu;
          hideNav = hideNav;
          break;
        case true:
          hideMenu = false;
          hideNav = false;
          break;
        case false:
          hideMenu = true;
          hideNav = true;
          break;
        default:
          hideMenu = layout.hideMenu === undefined ? hideMenu : layout.hideMenu;
          hideNav = layout.hideNav === undefined ? hideNav : layout.hideNav;
      }

      // 拼接 path
      const absolutePath = path.startsWith('/')
        ? path
        : `${base}${base === '/' ? '' : '/'}${path}`;

      LayoutConfig[`${prefix}${absolutePath}`] = {
        hideMenu,
        hideNav,
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
          {
            hideMenu,
            hideNav,
          },
          LayoutConfig,
        );
        LayoutConfig = { ...LayoutConfig, ...result };
      }
    });
  return LayoutConfig;
}

// 参数深比较
const getLayoutConfigFromRoute = memoizeOne(formatter, isEqual);

export default getLayoutConfigFromRoute;
