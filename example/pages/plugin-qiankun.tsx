import React from 'react';
import { MicroApp } from 'umi';

export default () => {
  return (
    <>
      <div>Main</div>
      <div id="microApp1">
        <MicroApp name="taobao" />
      </div>
      <div id="microApp2">
        <MicroApp name="taobao" autoCaptureError />
      </div>
      <div id="microApp3">
        <MicroApp
          name="taobao"
          autoCaptureError
          errorBoundary={(e) => <div>{e?.message}</div>}
        />
      </div>
    </>
  );
};
