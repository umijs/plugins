import React from 'react';
import * as umi from 'umi';

export function getMicroAppRouteComponent(opts: {
  appName: string;
  base: string;
  masterHistoryType: string;
  routeProps?: any;
}) {
  const { base, masterHistoryType, appName, routeProps } = opts;
  const { getCreateHistoryOptions, MicroApp } = umi;
  const RouteComponent = ({ match }: any) => {
    const { url } = match;

    // 默认取静态配置的 base
    let umiConfigBase = base === '/' ? '' : base;
    // 存在 getCreateHistoryOptions 说明当前应用开启了 runtimeHistory，此时取运行时的 history 配置的 basename
    if (typeof getCreateHistoryOptions === 'function') {
      const { basename = '/' } = getCreateHistoryOptions();
      umiConfigBase = basename === '/' ? '' : basename;
    }

    const runtimeMatchedBase =
      umiConfigBase + (url.endsWith('/') ? url.substr(0, url.length - 1) : url);

    const componentProps = {
      name: appName,
      base: runtimeMatchedBase,
      history: masterHistoryType,
      ...routeProps,
    };
    return React.createElement(MicroApp, componentProps);
  };

  return RouteComponent;
}
