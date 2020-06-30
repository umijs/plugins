/**
 * @author Kuitos
 * @since 2019-06-20
 */

import { IConfig } from '@umijs/types';
import { FrameworkConfiguration, FrameworkLifeCycles } from 'qiankun';

export type HistoryType = 'browser' | 'hash';
export type App = {
  name: string;
  entry: string | { scripts: string[]; styles: string[] };
  base?: string | string[];
  history?: HistoryType;
  props?: any;
} & Pick<IConfig, 'mountElementId'>;

export type MasterOptions = {
  apps: App[];
  lifeCycles?: FrameworkLifeCycles<object>;
  masterHistoryType?: HistoryType;
  // 关联路由标记的别名，默认 microApp
  routeBindingAlias?: string;
  // 导出的组件别名，默认 MicroApp
  exportComponentAlias?: string;
} & FrameworkConfiguration;

export type SlaveOptions = {
  keepOriginalRoutes?: boolean | string;
  shouldNotModifyRuntimePublicPath?: boolean;
  shouldNotModifyDefaultBase?: boolean;
};

declare module '@umijs/types' {
  interface IConfig {
    qiankun: {
      master?: MasterOptions;
      slave?: SlaveOptions;
    };
  }
}
