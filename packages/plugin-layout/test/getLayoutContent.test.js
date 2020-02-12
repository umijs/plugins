import getLayoutContent from '../src/utils/getLayoutContent';

describe('getLayoutContent', () => {
  test('getLayoutContent', () => {
    const LayoutContent = getLayoutContent({}, 'test');

    expect(LayoutContent).toEqual(
      `import React from 'react';
import { ApplyPluginsType } from 'umi';
import { plugin } from '../core/umiExports';

export default (props) => {
  const runtimeConfig = plugin.applyPlugins({
    key: 'layout',
    type: ApplyPluginsType.modify,
    initialValue: {},
  }) || {};
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
