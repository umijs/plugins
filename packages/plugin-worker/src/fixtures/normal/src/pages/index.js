import React from 'react';
import BarWorker from './bar.worker.js';

export default () => {
  const [visible, setVisible] = React.useState(false);
  const handleWorkder = () => {
    const worker = new BarWorker();
    console.log('worker', worker);
    worker.onmessage = function (evt) {
      // 主线程收到工作线程的消息
      if (evt.data && evt.data.value === '666') {
        setVisible(true);
      }
    };
    // 主线程向工作线程发送消息
    worker.postMessage({
      value: '主线程向工作线程发送消息'
    });
  }

  return (
    <div>
      <button onClick={handleWorkder}>click</button>
      <h1>{`${visible}`}</h1>
    </div>
  );
}
