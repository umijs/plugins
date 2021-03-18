/**
 * @author Kuitos
 * @since 2019-06-20
 */

import { BaseIConfig } from '@umijs/types';
import { FrameworkConfiguration, FrameworkLifeCycles } from 'qiankun';

export type HistoryType = 'browser' | 'hash';
export type App = {
  name: string;
  entry: string | { scripts: string[]; styles: string[] };
  base?: string | string[];
  history?: HistoryType;
  // 取 entry 时是否需要开启跨域 credentials
  credentials?: boolean;
  props?: any;
} & Pick<BaseIConfig, 'mountElementId'>;

export type MicroAppRoute = {
  path: string;
  microApp: string;
} & Record<string, any>;

export type MasterOptions = {
  apps: App[];
  routes?: MicroAppRoute[];
  lifeCycles?: FrameworkLifeCycles<object>;
  masterHistoryType?: HistoryType;
  base?: string;
  // 关联路由标记的别名，默认 microApp
  routeBindingAlias?: string;
  // 导出的组件别名，默认 MicroApp
  exportComponentAlias?: string;
} & FrameworkConfiguration;

export type SlaveOptions = {
  devSourceMap?: boolean;
  keepOriginalRoutes?: boolean | string;
  shouldNotModifyRuntimePublicPath?: boolean;
  shouldNotModifyDefaultBase?: boolean;
};

declare module '@umijs/types' {
  interface BaseIConfig {
    // @ts-ignore
    qiankun: {
      master?: MasterOptions;
      slave?: SlaveOptions;
    };
  }
}
