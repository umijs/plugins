import React, { useEffect } from 'react';
import { useModel } from './.umi/useModel';

export default () => {
  const message1 = useModel('user-hook');
  const message2 = useModel('权限');
  const message3 = useModel('counter`hook-backup@1.0');
  const message4 = useModel("umi's hook");
  return (<>
    <h2 data-testid="message1">{message1}</h2>
    <h2 data-testid="message2">{message2}</h2>
    <h2 data-testid="message3">{message3}</h2>
    <h2 data-testid="message4">{message4}</h2>
  </>);
}
