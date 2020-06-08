import React from 'react';
import { useModel } from 'umi';

export default function() {
  const { testProp1 } = useModel('@@qiankun') || {};
  return (
    <div>
      <h1>Dashboard 1</h1>
      <p>testProp1: {testProp1}</p>
    </div>
  );
}
