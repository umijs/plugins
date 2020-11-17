if (typeof onmessage !== 'undefined') {
  // 监听消息
  onmessage = function (evt) {
    // 工作线程收到主线程的消息
    console.log('workder receive: ');
  };
  postMessage({
    value: '666'
  });
}
