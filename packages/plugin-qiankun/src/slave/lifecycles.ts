import ReactDOM from 'react-dom';
// @ts-ignore
import { plugin, ApplyPluginsType } from 'umi';
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
  return async (...args: any[]) => {
    setModelState(args[0]);
    const slaveRuntime = getSlaveRuntime();
    if (slaveRuntime.bootstrap) {
      await slaveRuntime.bootstrap(...args);
    }
    render = oldRender;
  };
}

export function genMount() {
  return async (...args: any[]) => {
    const slaveRuntime = getSlaveRuntime();
    setModelState(args[0]);
    if (slaveRuntime.mount) {
      await slaveRuntime.mount(...args);
    }
    defer.resolve();
    // 第一次 mount umi 会自动触发 render，非第一次 mount 则需手动触发
    if (hasMountedAtLeastOnce) {
      render();
    }
    hasMountedAtLeastOnce = true;
  };
}

export function genUpdate() {
  return async (...args: any[]) => {
    const slaveRuntime = getSlaveRuntime();
    setModelState(args[0]);
    if (slaveRuntime.update) {
      await slaveRuntime.update(...args);
    }
    defer.resolve();
    // 第一次 mount umi 会自动触发 render，非第一次 mount 则需手动触发
    if (hasMountedAtLeastOnce) {
      render();
    }
    hasMountedAtLeastOnce = true;
  };
}

export function genUnmount(mountElementId: string) {
  return async (...args: any[]) => {
    const container = document.getElementById(mountElementId);
    if (container) {
      ReactDOM.unmountComponentAtNode(container);
    }
    const slaveRuntime = getSlaveRuntime();
    if (slaveRuntime.unmount) await slaveRuntime.unmount(...args);
  };
}
