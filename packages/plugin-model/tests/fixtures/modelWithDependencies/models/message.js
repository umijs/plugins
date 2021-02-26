import { useState } from 'react';
import { useModel } from '../.umi/useModel';

export default () => {
  // comments should be ignored
  // const message = useModel('message');
  const { role } = useModel('auth');
  return role === 'admin' ? 'Hello admin' : 'Hello user';
}
