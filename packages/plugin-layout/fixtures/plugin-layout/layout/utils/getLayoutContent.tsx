import { LayoutConfig } from '../types/interface.d';

export default (
  userConfig: LayoutConfig,
  path: string,
  formatMessage: boolean,
  hasAccess: boolean,
) => `import React, { useState, useEffect } from "react";
import { ApplyPluginsType, useModel ${
  // 没有 formatMessage 就不打开国际化
  formatMessage ? `, useIntl` : ''
}${hasAccess ? ', traverseModifyRoutes, useAccess' : ''} } from "umi";
import { plugin } from "../core/umiExports";
import LayoutComponent from '${path}';

export default props => {
  const [runtimeConfig, setRuntimeConfig] = useState(null);

  const initialInfo = (useModel && useModel("@@initialState")) || {
    initialState: undefined,
    loading: false,
    setInitialState: null
  }; // plugin-initial-state 未开启

  ${hasAccess ? 'const access = useAccess?.();' : ''}

  useEffect(() => {
    const useRuntimeConfig =
      plugin.applyPlugins({
        key: "layout",
        type: ApplyPluginsType.modify,
        initialValue: {
          ...initialInfo,
          ${
            hasAccess
              ? 'traverseModifyRoutes: (menuData) => {return traverseModifyRoutes?.(menuData, access);},'
              : ''
          }
        },
      }) || {};
    if (useRuntimeConfig instanceof Promise) {
      useRuntimeConfig.then((config) => {
        setRuntimeConfig(config);
      });
      return;
    }
    setRuntimeConfig(useRuntimeConfig);
  }, [initialInfo?.initialState, ${hasAccess ? 'access' : ''}]);

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

const genRenderRightContent = (props: {
  locale: boolean;
  initialState: boolean;
}) => {
  if (!props.initialState) {
    return `export default function renderRightContent() {
    return null;
  }
  `;
  }
  return `import React from 'react';
  import { Avatar, Dropdown, Menu, Spin } from 'antd';
  ${props.locale ? "import { SelectLang } from 'umi';" : ''}
  import { LogoutOutlined } from '@ant-design/icons';
  import { ILayoutRuntimeConfig } from '../types/interface.d';

  export default function renderRightContent(
    runtimeLayout: ILayoutRuntimeConfig,
    loading: boolean,
    initialState: any,
    setInitialState: any,
  ) {
    if (runtimeLayout.rightRender) {
      return runtimeLayout.rightRender(
        initialState,
        setInitialState,
        runtimeLayout,
      );
    }

    const menu = (
      <Menu className="umi-plugin-layout-menu">
        <Menu.Item
          key="logout"
          onClick={() =>
            runtimeLayout.logout && runtimeLayout?.logout(initialState)
          }
        >
          <LogoutOutlined />
          退出登录
        </Menu.Item>
      </Menu>
    );

    const avatar = (
      <span className="umi-plugin-layout-action">
        <Avatar
          size="small"
          className="umi-plugin-layout-avatar"
          src={
            initialState?.avatar ||
            'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
          }
          alt="avatar"
        />
        <span className="umi-plugin-layout-name">{initialState?.name}</span>
      </span>
    );

    if (loading) {
      return (
        <div className="umi-plugin-layout-right">
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        </div>
      );
    }

    return (
      <div className="umi-plugin-layout-right anticon">
        {runtimeLayout.logout ? (
          <Dropdown overlay={menu} overlayClassName="umi-plugin-layout-container">
            {avatar}
          </Dropdown>
        ) : (
          avatar
        )}
        ${props.locale ? '{SelectLang && <SelectLang />}' : ''}
      </div>
    );
  }
  `;
};

export { genRenderRightContent };
