import { useState } from 'react';

let initState: any;
let setModelState = (val: any) => {
  initState = val;
};

export default () => {
  const [state, setState] = useState(initState);
  setModelState = (val) => {
    initState = val;
    setState(val);
  };

  return state;
};

export { setModelState };
