import { IRoute } from 'umi';
import { cloneDeep } from 'lodash';
import { SlaveOptions } from '../types';

const recursiveCoverRouter = (source: Array<IRoute>, nameSpacePath: string) =>
  source.map((router: IRoute) => {
    if (router.routes) {
      recursiveCoverRouter(router.routes, nameSpacePath);
    }
    if (router.path !== '/' && router.path) {
      return {
        ...router,
        path: `${nameSpacePath}${router.path}`,
      };
    }
    return router;
  });

export const addSpecifyPrefixedRoute = (
  originRoute: Array<IRoute>,
  keepOriginalRoutes: SlaveOptions['keepOriginalRoutes'],
  pkgName?: string,
) => {
  const copyBase = originRoute.filter((_) => _.path === '/');
  if (!copyBase[0]) {
    return originRoute;
  }

  const nameSpaceRouter: any = cloneDeep(copyBase[0]);
  const nameSpace = keepOriginalRoutes === true ? pkgName : keepOriginalRoutes;

  nameSpaceRouter.path = `/${nameSpace}`;
  nameSpaceRouter.routes = recursiveCoverRouter(
    nameSpaceRouter.routes,
    `/${nameSpace}`,
  );

  return [nameSpaceRouter, ...originRoute];
};
