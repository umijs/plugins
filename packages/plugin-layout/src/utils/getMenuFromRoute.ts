/**
 * 通过路由配置自动生成菜单配置
 */
import { flatten } from 'lodash';
import {
  IBestAFSRoute,
  MenuItem,
  IRouteMenuConfig,
} from '../types/interface.d';

/**
 * Conversion router to menu.
 * - menu 中的全部参数，支持平铺式写法, menu 中的优先级更高
 * - indexRoute 已经被前置插件处理打平处理掉了
 * - menu 国际化
 */
function formatter(
  baseRoutes: IBestAFSRoute[] = [],
  prefix: string = '',
  base: string = '/',
): MenuItem[] {
  const menus = flatten(
    baseRoutes
      .filter(
        item =>
          item &&
          !item.unaccessible && // 是否没有权限查看
          item.menu !== false && // 显示指定在 menu 中隐藏该项
          (item.name || // 兼容老版本 route 配置
          item.flatMenu || // 是否打平 menu
          (item.menu && (item.menu.name || item.menu.flatMenu)) || // 正确配置了 menu
            (item.indexRoute &&
              item.indexRoute.menu &&
              (item.indexRoute.menu.name || item.indexRoute.menu.flatMenu))), // 有 indexRoute 且正确配置了中的 menu
      )
      .map(route => {
        const { menu = {}, indexRoute, path = '', routes } = route;
        const {
          name = route.name,
          icon = route.icon,
          hideChildren = route.hideChildren,
          flatMenu = route.flatMenu,
        } = menu as IRouteMenuConfig; // 兼容平铺式写法

        // 拼接 path
        const absolutePath =
          path.startsWith('/') || path.startsWith('http')
            ? path
            : `${base}${base === '/' ? '' : '/'}${path}`;

        // 拼接 childrenRoutes, 处理存在 indexRoute 时的逻辑
        const childrenRoutes = indexRoute
          ? [
              {
                path,
                menu,
                ...indexRoute,
              },
            ].concat(routes || [])
          : routes;

        // 拼接返回的 menu 数据
        const result = {
          ...route,
          name,
          path: path.startsWith('http')
            ? absolutePath
            : `${prefix}${absolutePath}`,
        } as MenuItem;

        if (icon) {
          result.icon = icon;
        }

        if (childrenRoutes && childrenRoutes.length) {
          /** 在菜单中隐藏子项 */
          if (hideChildren) {
            delete result.children;
            return result;
          }

          const children = formatter(childrenRoutes, prefix, absolutePath);

          /** 在菜单中只隐藏此项，子项往上提，仍旧展示 */
          if (flatMenu) {
            return children;
          }

          result.children = children;
          // delete result.path;
        }
        return result;
      }),
  );
  return menus;
}

export default formatter;
