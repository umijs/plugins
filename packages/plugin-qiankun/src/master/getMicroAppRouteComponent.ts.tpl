import React from 'react';
import { MicroApp } from 'umi';
{{#runtimeHistory}}
import { getCreateHistoryOptions } from 'umi';
{{/runtimeHistory}}

export function getMicroAppRouteComponent(opts: {
  appName: string;
  base: string;
  masterHistoryType: string;
  routeProps?: any;
}) {
  const { base, masterHistoryType, appName, routeProps } = opts;
  const RouteComponent = ({ match }: any) => {
    const { url } = match;

    // 默认取静态配置的 base
    let umiConfigBase = base === '/' ? '' : base;

    {{#runtimeHistory}}
    // 存在 getCreateHistoryOptions 说明当前应用开启了 runtimeHistory，此时取运行时的 history 配置的 basename
    const { basename = '/' } = getCreateHistoryOptions();
    umiConfigBase = basename === '/' ? '' : basename;
    {{/runtimeHistory}}

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
