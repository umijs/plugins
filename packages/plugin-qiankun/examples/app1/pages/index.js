import React, { useState } from 'react';
import { useModel, MicroAppWithMemoHistory } from 'umi';
import { Drawer } from 'antd';

export default function () {
  const { testProp1, globalState } = useModel('@@qiankunStateFromMaster') || {};
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <h1>Dashboard 1</h1>
      <p>testProp1: {testProp1}</p>
      <p>globalState: {JSON.stringify(globalState)}</p>

      <h1>MicroAppWithMemoHistory</h1>
      <button
        onClick={() => {
          setVisible(true);
        }}
      >
        打开 app2
      </button>

      <Drawer
        title="嵌入 app2"
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        width={800}
      >
        <MicroAppWithMemoHistory
          name="app2"
          url="/user"
          current={2}
          pageSize={5}
        />
      </Drawer>
    </div>
  );
}
