import React from 'react';
import { useModel } from 'umi';

export default function() {
  const { testProp1, globalState } = useModel('@@qiankunStateFromMaster') || {};
  return (
    <div>
      <h1>Dashboard 1</h1>
      <p>testProp1: {testProp1}</p>
      <p>globalState: {JSON.stringify(globalState)}</p>
    </div>
  );
}
