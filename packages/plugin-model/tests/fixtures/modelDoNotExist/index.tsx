import React from 'react';
import { useModel } from './.umi/useModel';

export default () => {
  return (<>
    <h2 data-testid="useModel">{`useModel is: ${useModel}`}</h2>
  </>);
}
