// This file is for runtime, not the compile time.
import { IRoute } from 'umi';

type Routes = IRoute[];

export function traverseModifyRoutes(routes: Routes, access: any): Routes {
  const resultRoutes: Routes = []
    .concat(routes as any)
    .map((resultRoute: IRoute) => {
      const { routes } = resultRoute;
      if (routes && routes?.map) {
        return {
          ...resultRoute,
          // return new route to routes.
          routes: routes?.map((route: any) => ({ ...route })),
        };
      }
      return resultRoute;
    });

  return resultRoutes.map((currentRoute) => {
    let currentRouteAccessible =
      typeof currentRoute.unaccessible === 'boolean'
        ? !currentRoute.unaccessible
        : true;

    // 判断路由是否有权限的具体代码
    if (currentRoute && currentRoute.access) {
      if (typeof currentRoute.access !== 'string') {
        throw new Error(
          '[plugin-access]: "access" field set in "' +
            currentRoute.path +
            '" route should be a string.',
        );
      }
      const accessProp = access[currentRoute.access];
      // 如果是方法需要执行以下
      if (typeof accessProp === 'function') {
        currentRouteAccessible = accessProp(currentRoute);
      } else if (typeof accessProp === 'boolean') {
        // 不是方法就直接 copy
        currentRouteAccessible = accessProp;
      }
      currentRoute.unaccessible = !currentRouteAccessible;
    }

    // 筛选子路由
    if (currentRoute.routes || currentRoute.childRoutes) {
      const childRoutes: Routes =
        currentRoute.routes || currentRoute.childRoutes;

      if (!Array.isArray(childRoutes)) {
        return currentRoute;
      }
      // 父亲没权限，理论上每个孩子都没权限
      // 可能有打平 的事情发生，所以都执行一下
      childRoutes.forEach((childRoute) => {
        childRoute.unaccessible = !currentRouteAccessible;
      });
      const finallyChildRoute = traverseModifyRoutes(childRoutes, access);

      // 如果每个子节点都没有权限，那么自己也属于没有权限
      const isAllChildRoutesUnaccessible =
        Array.isArray(finallyChildRoute) &&
        finallyChildRoute.every((route) => route.unaccessible);

      if (!currentRoute.unaccessible && isAllChildRoutesUnaccessible) {
        currentRoute.unaccessible = true;
      }
      if (finallyChildRoute && finallyChildRoute?.length > 0) {
        return {
          ...currentRoute,
          routes: finallyChildRoute,
        };
      }
      delete currentRoute.routes;
    }

    return currentRoute;
  });
}
