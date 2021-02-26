import { useState } from 'react';
import request from './services/request';

export const qiankun = request('/apps').then((apps) => ({
  apps,
  routes: [
    {
      path: '/app1',
      microApp: 'app1',
      microAppProps: {
        autoSetLoading: true,
        className: 'appClassName',
        wrapperClassName: 'wrapperClass',
        loader: (loading) => {
          return loading ? <div>runtime loading</div> : null;
        },
      },
    },
  ],
}));

export const useQiankunStateForSlave = () => {
  const [globalState, setQiankunGlobalState] = useState({
    slogan: 'Hello MicroFrontend',
  });

  return {
    globalState,
    setQiankunGlobalState,
  };
};
