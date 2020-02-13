import request from './services/request';

// TODO 当前 umi 运行时配置还不支持 Promise
// const qiankunConfig = request('/apps').then(apps => ({ apps }));

export const qiankun = {
  apps: [
    {
      name: 'app1',
      entry: 'http://localhost:8001/app1',
      base: '/app1',
      mountElementId: 'root-subapp-container',
    },
  ],
};
