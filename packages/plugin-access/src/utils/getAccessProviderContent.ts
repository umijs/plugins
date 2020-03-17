export default function() {
  return `\
import React, { useMemo } from 'react';
import { IRoute } from 'umi';
import { useModel } from '../core/umiExports';
import accessFactory from '../../access';
import AccessContext, { AccessInstance } from './context';

type Routes = IRoute[];

function traverseModifyRoutes(routes: Routes, access: AccessInstance = {} as AccessInstance) {
  const resultRoutes: Routes = [].concat(routes as any);
  const notHandledRoutes: Routes = [];

  notHandledRoutes.push(...resultRoutes);

  for (let i = 0; i < notHandledRoutes.length; i++) {
    const currentRoute = notHandledRoutes[i];
    let currentRouteAccessible = typeof currentRoute.unaccessible === 'boolean' ? !currentRoute.unaccessible : true;
    if (currentRoute && currentRoute.access) {
      if (typeof currentRoute.access !== 'string') {
        throw new Error('[plugin-access]: "access" field set in "' + currentRoute.path + '" route should be a string.');
      }
      const accessProp = access[currentRoute.access];
      if (typeof accessProp === 'function') {
        currentRouteAccessible = accessProp(currentRoute)
      } else if (typeof accessProp === 'boolean') {
        currentRouteAccessible = accessProp;
      }
      currentRoute.unaccessible = !currentRouteAccessible;
    }

    if (currentRoute.routes || currentRoute.childRoutes) {
      const childRoutes: Routes = currentRoute.routes || currentRoute.childRoutes;
      if (!Array.isArray(childRoutes)) {
        continue;
      }
      childRoutes.forEach(childRoute => { childRoute.unaccessible = !currentRouteAccessible }); // Default inherit from parent route
      notHandledRoutes.push(...childRoutes);
    }
  }

  return resultRoutes;
}

interface Props {
  children: React.ReactNode;
}

const AccessProvider: React.FC<Props> = props => {
  if (typeof useModel !== 'function') {
    throw new Error('[plugin-access]: useModel is not a function, @umijs/plugin-initial-state is needed.')
  }

  const { children } = props;
  const { initialState } = useModel('@@initialState');

  const access = useMemo(() => accessFactory(initialState as any), [initialState]);

  if (process.env.NODE_ENV === 'development' && (access === undefined || access === null)) {
    console.warn('[plugin-access]: the access instance created by access.ts(js) is nullish, maybe you need check it.');
  }

  props.routes.splice(0, props.routes.length, ...traverseModifyRoutes(props.routes, access));

  return React.createElement(
    AccessContext.Provider,
    { value: access },
    children,
  );
};

export default AccessProvider;
`;
}
