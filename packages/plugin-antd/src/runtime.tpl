import React from "react";
{{#newAntd}}
import { ConfigProvider, message } from "antd";
{{/newAntd}}

{{#oldAntd}}
import { ConfigProvider, Modal, notification, message } from "antd";
{{/oldAntd}}
 
import { ApplyPluginsType } from "umi";
import { plugin } from "../core/umiExports";

export function rootContainer(container) {
  const runtimeAntd = plugin.applyPlugins({
    key: "antd",
    type: ApplyPluginsType.modify,
    initialValue: {},
  });

  const finalConfig = {...{{{ config }}},...runtimeAntd}

  if (finalConfig.prefixCls) {
    {{#newAntd}}
      // 新版本的写法
      ConfigProvider.config({
        prefixCls: finalConfig.prefixCls,
      });
    {{/newAntd}}

    {{#oldAntd}}
      // 老版本的antd需要这些写
      Modal.config({
        rootPrefixCls: finalConfig.prefixCls,
      });
      notification.config({
        prefixCls: `${finalConfig.prefixCls}-notification`,
      });
    {{/oldAntd}}
    message.config({
      prefixCls: `${finalConfig.prefixCls}-message`,
    });
  }
  return React.createElement(ConfigProvider, finalConfig, container);
}
