import React from 'react';

export function rootContainer(container: React.ReactNode) {
  return React.createElement(require('./Provider').default, null, container);
}
