import { useState } from 'react';

let isMounted = false;
let initState: any;
let setModelState = (val: any) => {
  initState = val;
};

export default () => {
  const [state, setState] = useState(initState);
  setModelState = (val: any) => {
    initState = val;
    if (isMounted) setState(val);
  };

  useEffect(() => {
    isMounted = true;
    return () => { isMounted = false }; // use effect cleanup to set flag false, if unmounted
  });

  return state;
};

export { setModelState };
