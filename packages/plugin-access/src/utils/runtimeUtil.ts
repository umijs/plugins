// This file is for runtime, not the compile time.
import { IRoute } from 'umi';

type Routes = IRoute[];

export function traverseModifyRoutes(routes: Routes, access: any) {
  const resultRoutes: Routes = []
    .concat(routes as any)
    .map((resultRoute: IRoute) => {
      const { routes } = resultRoute;
      return {
        ...resultRoute,
        // return new route to routes.
        routes: routes ? routes.map((route: any) => ({ ...route })) : routes,
      };
    });
  const notHandledRoutes: Routes = [];

  notHandledRoutes.push(...resultRoutes);

  for (let i = 0; i < notHandledRoutes.length; i++) {
    const currentRoute = notHandledRoutes[i];
    let currentRouteAccessible =
      typeof currentRoute.unAccessible === 'boolean'
        ? !currentRoute.unAccessible
        : true;
    if (currentRoute && currentRoute.access) {
      if (typeof currentRoute.access !== 'string') {
        throw new Error(
          '[plugin-access]: "access" field set in "' +
            currentRoute.path +
            '" route should be a string.',
        );
      }
      const accessProp = access[currentRoute.access];
      if (typeof accessProp === 'function') {
        currentRouteAccessible = accessProp(currentRoute);
      } else if (typeof accessProp === 'boolean') {
        currentRouteAccessible = accessProp;
      }
      currentRoute.unAccessible = !currentRouteAccessible;
    }

    if (currentRoute.routes || currentRoute.childRoutes) {
      const childRoutes: Routes =
        currentRoute.routes || currentRoute.childRoutes;
      if (!Array.isArray(childRoutes)) {
        continue;
      }
      childRoutes.forEach(childRoute => {
        childRoute.unAccessible = !currentRouteAccessible;
      }); // Default inherit from parent route
      notHandledRoutes.push(...childRoutes);
    }
  }

  // Make parent route unAccessible if child routes exist and all of child routes are unAccessible
  for (let i = 0; i < notHandledRoutes.length; i++) {
    const currentRoute = notHandledRoutes[i];
    const childRoutes: Routes = currentRoute.routes || currentRoute.childRoutes;
    const isAllChildRoutesUnaccessible =
      Array.isArray(childRoutes) &&
      childRoutes.every(route => route.unAccessible);
    if (!currentRoute.unAccessible && isAllChildRoutesUnaccessible) {
      currentRoute.unAccessible = true;
    }
  }

  return resultRoutes;
}
