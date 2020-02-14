import { useState } from 'react';

export default () => {
  const [initialState] = useState('initialtest');
  return { initialState };
};
