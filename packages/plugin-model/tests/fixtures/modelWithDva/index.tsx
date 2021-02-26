import React, { useEffect } from 'react';
import { useModel } from './.umi/useModel';

export default () => {
  const dva = useModel('dva');
  const hook1 = useModel('hook1');
  const hook2 = useModel('hook2');
  const hook3 = useModel('hook3');
  const hook4 = useModel('hook4');
  const hook5 = useModel('hook5');
  const hook6 = useModel('hook6');
  const hook7 = useModel('hook7');

  return (<>
    <h2 data-testid="dva">{`${dva}`}</h2>
    <h2 data-testid="hook1">{`${hook1}`}</h2>
    <h2 data-testid="hook2">{`${hook2}`}</h2>
    <h2 data-testid="hook3">{`${hook3}`}</h2>
    <h2 data-testid="hook4">{`${hook4}`}</h2>
    <h2 data-testid="hook5">{`${hook5}`}</h2>
    <h2 data-testid="hook6">{`${hook6}`}</h2>
    <h2 data-testid="hook7">{`${hook7}`}</h2>
  </>);
}
