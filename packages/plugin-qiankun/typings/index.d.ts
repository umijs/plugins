/**
 * @author Kuitos
 * @since 2019-06-20
 */
declare module '@tmp/subAppsConfig.json';

declare module '@tmp/qiankunRootExports.js';

declare module '@@/plugin-qiankun/qiankunDefer.js' {
  const deferred: any;
  export { deferred };
}

declare module '@@/plugin-qiankun/masterOptions' {
  export const getMasterOptions: () => any;
  export const setMasterOptions: (options: any) => void;
}

declare module '@@/plugin-qiankun/MicroAppLoader' {
  import { ReactNode } from 'react';
  export default function Loader(props: { loading: boolean }): ReactNode;
}
