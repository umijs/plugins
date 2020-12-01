import { LayoutConfig } from '../types/interface.d';

export default (
  userConfig: LayoutConfig,
  path: string,
  formatMessage: boolean,
) => `import React, { useState, useEffect } from "react";
import { ApplyPluginsType, useModel ${
  // 没有 formatMessage 就不打开国际化
  formatMessage ? `, useIntl` : ''
} } from "umi";
import { plugin } from "../core/umiExports";
import LayoutComponent from '${path}';

export default props => {
  const [runtimeConfig, setRuntimeConfig] = useState(null);

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
    ...${JSON.stringify(userConfig).replace(/"/g, "'")},
    ...runtimeConfig || {}
  };

  ${formatMessage ? 'const { formatMessage } = useIntl();' : ''}

  if(!runtimeConfig){
    return null
  }

  return React.createElement(LayoutComponent, {
    userConfig,
    ${formatMessage ? 'formatMessage,' : ''}
    ...props
  });
};
`;
