import { useState } from 'react';
import request from './services/request';

export const qiankun = request('/apps').then(apps => ({ apps }));

export const useQiankunStateForSlave = () => {
  const [globalState, setQiankunGlobalState] = useState({
    slogan: 'Hello MicroFrontend',
  });

  return {
    globalState,
    setQiankunGlobalState,
  };
};
