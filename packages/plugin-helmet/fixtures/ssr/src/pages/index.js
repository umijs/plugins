import React from 'react';
import { Helmet } from '../.umi-test/core/umiExports';

export default function() {
  return (
    <div>
      <h1>Hello Helmet</h1>
      <Helmet>
        <html lang="zh" data-direction="top" />
        <title>Title Helmet</title>
      </Helmet>
    </div>
  );
}
