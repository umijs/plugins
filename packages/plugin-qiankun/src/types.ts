/**
 * @author Kuitos
 * @since 2019-06-20
 */

import { ImportEntryOpts } from 'import-html-entry';
import { FrameworkLifeCycles } from 'qiankun';
// @ts-ignore
import { IConfig } from 'umi-types';

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
  jsSandbox: boolean;
  prefetch: boolean;
  defer?: boolean;
  lifeCycles?: FrameworkLifeCycles<object>;
  masterHistoryType?: HistoryType;
} & ImportEntryOpts;

export type SlaveOptions = {
  keepOriginalRoutes?: boolean | string;
  shouldNotModifyRuntimePublicPath?: boolean;
};
