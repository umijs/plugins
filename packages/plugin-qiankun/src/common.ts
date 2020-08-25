/**
 * @author Kuitos
 * @since 2019-06-20
 */

import pathToRegexp from 'path-to-regexp';

export const defaultMountContainerId = 'root-subapp';

// @formatter:off
export const noop = () => {};
// @formatter:on

export function toArray<T>(source: T | T[]): T[] {
  return Array.isArray(source) ? source : [source];
}

function testPathWithStaticPrefix(pathPrefix: string, realPath: string) {
  if (pathPrefix.endsWith('/')) {
    return realPath.startsWith(pathPrefix);
  }

  const pathRegex = new RegExp(`^${pathPrefix}(\\/|\\?)+.*$`, 'g');
  const normalizedPath = `${realPath}/`;
  return pathRegex.test(normalizedPath);
}

function testPathWithDynamicRoute(dynamicRoute: string, realPath: string) {
  return !!pathToRegexp(dynamicRoute, { strict: true, end: false }).exec(
    realPath,
  );
}

export function testPathWithPrefix(pathPrefix: string, realPath: string) {
  return (
    testPathWithStaticPrefix(pathPrefix, realPath) ||
    testPathWithDynamicRoute(pathPrefix, realPath)
  );
}
