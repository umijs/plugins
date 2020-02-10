import getLayoutContent from '../src/utils/getLayoutContent';

describe('getLayoutContent', () => {
  test('getLayoutContent', () => {
    const LayoutContent = getLayoutContent({}, 'test');

    expect(LayoutContent).toEqual(
      `import React from 'react';

export default (props) => {
  const runtimeConfig = require('umi/_runtimePlugin').mergeConfig('layout') || {};
  const userConfig = {
    ...{},
    ...runtimeConfig
  };
  return React.createElement(require('test').default, {
    userConfig,
    ...props
  })
}
`,
    );
  });
});
