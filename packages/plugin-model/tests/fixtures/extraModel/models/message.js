import { useState } from 'react';
import { useModel } from '../.umi/useModel';

export default () => {
  const { role } = useModel('auth');
  const { initialState } = useModel('@@initialState');
  return {
    initial: initialState,
    message: role === 'admin' ? 'Hello admin' : 'Hello user',
  };
};
