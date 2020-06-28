import { useState } from 'react';

let initState: any;
let setModelState = (val: any) => {
  initState = val;
};

export default () => {
  const [state, setState] = useState(initState);
  setModelState = setState;

  return state;
};

export { setModelState };
