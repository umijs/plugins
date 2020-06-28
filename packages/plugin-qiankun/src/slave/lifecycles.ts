import ReactDOM from 'react-dom';
// @ts-ignore
import { plugin, ApplyPluginsType, setCreateHistoryOptions } from 'umi';
// @ts-ignore
import { setModelState } from '../qiankunModel';
import { noop } from '../common';

type Defer = {
  promise: Promise<any>;
  resolve(value?: any): void;
};

// @ts-ignore
const defer: Defer = {};
defer.promise = new Promise(resolve => {
  defer.resolve = resolve;
});

let render = noop;
let hasMountedAtLeastOnce = false;

export default () => defer.promise;

function normalizeHistory(
  history?: 'string' | Record<string, any>,
  base?: string,
) {
  let normalizedHistory: Record<string, any> = {};
  if (base) normalizedHistory.basename = base;
  if (history) {
    if (typeof history === 'string') {
      normalizedHistory.type = history;
    } else {
      normalizedHistory = history;
    }
  }

  return normalizedHistory;
}

function getSlaveRuntime() {
  const config = plugin.applyPlugins({
    key: 'qiankun',
    type: ApplyPluginsType.modify,
    initialValue: {},
  });
  const { slave } = config;
  return slave || config;
}

export function genBootstrap(oldRender: typeof noop) {
  return async (props: any) => {
    const slaveRuntime = getSlaveRuntime();
    if (slaveRuntime.bootstrap) {
      await slaveRuntime.bootstrap(props);
    }
    render = oldRender;
  };
}

export function genMount() {
  return async (props?: any) => {
    setModelState(props);

    const slaveRuntime = getSlaveRuntime();
    if (slaveRuntime.mount) {
      await slaveRuntime.mount(props);
    }

    // 动态改变 history
    const historyOptions = normalizeHistory(props?.history, props?.base);
    setCreateHistoryOptions(historyOptions);

    defer.resolve();
    // 第一次 mount umi 会自动触发 render，非第一次 mount 则需手动触发
    if (hasMountedAtLeastOnce) {
      render();
    }
    hasMountedAtLeastOnce = true;
  };
}

export function genUpdate() {
  return async (props: any) => {
    setModelState(props);

    const slaveRuntime = getSlaveRuntime();
    if (slaveRuntime.update) {
      await slaveRuntime.update(props);
    }
  };
}

export function genUnmount(mountElementId: string) {
  return async (props: any) => {
    const container = document.getElementById(mountElementId);
    if (container) {
      ReactDOM.unmountComponentAtNode(container);
    }
    const slaveRuntime = getSlaveRuntime();
    if (slaveRuntime.unmount) await slaveRuntime.unmount(props);
  };
}
