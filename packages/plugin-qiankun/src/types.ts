/**
 * @author Kuitos
 * @since 2019-06-20
 */

import { ImportEntryOpts } from 'import-html-entry';
import { LifeCycles } from 'qiankun';
// @ts-ignore
import { IConfig } from 'umi-types';

export type HistoryType = 'browser' | 'hash';
export type App = {
  name: string;
  entry: string | { scripts: string[]; styles: string[] };
  base: string | string[];
  history?: HistoryType;
  props?: any;
} & Pick<IConfig, 'mountElementId'>;

export type Options = {
  apps: App[];
  jsSandbox: boolean;
  prefetch: boolean;
  defer?: boolean;
  lifeCycles?: LifeCycles<object>;
  masterHistoryType: HistoryType;
  registerRuntimeKeyInIndex?: boolean; // 仅做插件本身透传用，开发者无需关心
  keepOriginalRoutes?: keepOriginalRoutesOption;
} & ImportEntryOpts;

export type keepOriginalRoutesOption = boolean | string;

export type GlobalOptions = {
  master?: Options;
  slave?: Options;
};
