import { useState } from 'react';

let initState;
let setModelState = val => {
  initState = val;
};

export default () => {
  const [state, setState] = useState(initState);
  setModelState = setState;

  return state;
};

export { setModelState };
