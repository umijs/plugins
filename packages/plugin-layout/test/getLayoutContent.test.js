import getLayoutContent from '../src/utils/getLayoutContent';

describe('getLayoutContent', () => {
  test('getLayoutContent', () => {
    const LayoutContent = getLayoutContent({}, 'test');

    expect(LayoutContent).toEqual(
      `import React, { useState, useEffect } from "react";
      import { ApplyPluginsType, useModel } from "umi";
      import { plugin } from "../core/umiExports";
      
      export default props => {
        const [runtimeConfig, setRuntimeConfig] = useState({});
      
        const initialInfo = (useModel && useModel("@@initialState")) || {
          initialState: undefined,
          loading: false,
          setInitialState: null
        }; // plugin-initial-state 未开启
      
        useEffect(() => {
          const useRuntimeConfig =
            plugin.applyPlugins({
              key: "layout",
              type: ApplyPluginsType.modify,
              initialValue: initialInfo
            }) || {};
          if (useRuntimeConfig instanceof Promise) {
            useRuntimeConfig.then(config => {
              setRuntimeConfig(config);
            });
            return;
          }
          setRuntimeConfig(useRuntimeConfig);
        }, [initialInfo?.initialState]);
        const userConfig = {
          ...{},
          ...runtimeConfig
        };
        return React.createElement(require("test").default, {
          userConfig,
          ...props
        });
      };}
`,
    );
  });
});
