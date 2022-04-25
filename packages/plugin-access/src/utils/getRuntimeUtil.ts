// This file is for runtime, not the compile time.
export default (strictMode: boolean = false) =>
  `import { IRoute } from 'umi';

  type ChildrenList = IRoute[];

  const oldChildrenPropsName = 'routes';
  
  export function traverseModifyRoutes(childrenList: ChildrenList, access: any): ChildrenList {
    const resultChildrenList: ChildrenList = []
      .concat(childrenList as any)
      .map((resultRoute: IRoute) => {
        const childList = resultRoute.children || resultRoute[oldChildrenPropsName];
        if (childList && childList?.length) {
          return {
            ...resultRoute,
            children: childList?.map((route: any) => ({ ...route })),
            // return new route to routes.
            [oldChildrenPropsName]: childList?.map((route: any) => ({ ...route })),
          };
        }
        return resultRoute;
      });
  
    return resultChildrenList.map((currentRoute) => {
      let currentRouteAccessible =
        typeof currentRoute.unaccessible === 'boolean' ? !currentRoute.unaccessible : true;

      if(currentRoute && ${strictMode}){
        currentRoute.unaccessible = true;
      }

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
      const childList = currentRoute.children || currentRoute[oldChildrenPropsName];
      // 筛选子路由
      if (childList && Array.isArray(childList) && childList.length) {
        if (!Array.isArray(childList)) {
          return currentRoute;
        }
        // 父亲没权限，理论上每个孩子都没权限
        // 可能有打平 的事情发生，所以都执行一下
        childList.forEach((childRoute) => {
          childRoute.unaccessible = !currentRouteAccessible;
        });
        const finallyChildList = traverseModifyRoutes(childList, access);
  
        // 如果每个子节点都没有权限，那么自己也属于没有权限
        const isAllChildChildrenUnaccessible =
          Array.isArray(finallyChildList) && finallyChildList.every((route) => route.unaccessible);
  
        if (!currentRoute.unaccessible && isAllChildChildrenUnaccessible) {
          currentRoute.unaccessible = true;
        }
        if (finallyChildList && finallyChildList?.length > 0) {
          return {
            ...currentRoute,
            children: finallyChildList,
            [oldChildrenPropsName]: finallyChildList,
          };
        }
        delete currentRoute.routes;
        delete currentRoute.children;
      }
  
      return currentRoute;
    });
}`;
