import React, { useState } from 'react';
import { MicroApp } from 'umi';

const CustomErrorBoundary = () => {
  return <div>MicroApp has Error</div>;
};

export default () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <div>Main</div>
      <button onClick={() => setVisible(true)}>
        load a MicroApp without ErrorBoundary
      </button>
      <MicroApp name="app1" />
      <MicroApp name="app2" errorBoundary={<CustomErrorBoundary />} />
      {visible && <MicroApp name="app3" errorBoundary={false} />}
    </>
  );
};
