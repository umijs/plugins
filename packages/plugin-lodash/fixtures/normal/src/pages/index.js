import React from 'react';
import { isEmpty } from 'lodash';

export default function() {
  return (
    <div>
      <h1>{isEmpty('hello_lodash')}</h1>
    </div>
  );
}
