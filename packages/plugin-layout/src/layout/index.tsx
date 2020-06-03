import React from 'react';
// @ts-ignore
import { Link, useModel, history, useIntl, InitialState } from 'umi';
import pathToRegexp from 'path-to-regexp';
import ProLayout from '@ant-design/pro-layout';

// component
import ErrorBoundary from '../component/ErrorBoundary';
import renderRightContent from './renderRightContent';
import { WithExceptionOpChildren } from '../component/Exception';

// hooks & utils
import useLayoutConfig from './useLayoutConfig';
import getLayoutConfigFromRoute from '../utils/getLayoutConfigFromRoute';
import getMenuDataFromRoutes from '../utils/getMenuFromRoute';

import { MenuItem } from '../types/interface.d';
import './style.less';
// @ts-ignore
import logo from '../assets/logo.svg';

const BasicLayout = (props: any) => {
  const { children, userConfig, location, route, ...restProps } = props;
  const { routes = [] } = route;
  const _routes = require('@@/core/routes').routes;

  // 获取全局初始化信息
  const initialInfo = (useModel && useModel('@@initialState')) || {
    initialState: undefined,
    loading: false,
    setInitialState: null,
  }; // plugin-initial-state 未开启
  const { initialState, loading, setInitialState } = initialInfo;

  // 国际化插件并非默认启动
  const intl = useIntl && useIntl();

  // Menus 配置相关
  const patchMenus: (ms: MenuItem[], initialInfo: InitialState) => MenuItem[] =
    userConfig.patchMenus || ((ms: MenuItem[]): MenuItem[] => ms);
  const menus = patchMenus(getMenuDataFromRoutes(routes), initialInfo);

  // Layout 配置相关
  const pathName = location.pathname;
  const layoutConfigs = getLayoutConfigFromRoute(_routes);
  const currentMatchPaths = Object.keys(layoutConfigs).filter(item =>
    pathToRegexp(`${item}(.*)`).test(pathName),
  );
  const layoutConfig = currentMatchPaths.length
    ? layoutConfigs[currentMatchPaths[currentMatchPaths.length - 1]]
    : undefined;
  const [currentLayoutConfig, layoutRender] = useLayoutConfig(layoutConfig);

  return (
    <ProLayout
      title={userConfig.name || userConfig.title}
      className="umi-plugin-layout-main"
      navTheme="dark"
      siderWidth={256}
      onMenuHeaderClick={e => {
        e.stopPropagation();
        e.preventDefault();
        history.push('/');
      }}
      menu={{ locale: userConfig.locale }}
      menuDataRender={() => menus}
      formatMessage={intl && intl.formatMessage}
      logo={logo}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children) {
          return defaultDom;
        }
        if (menuItemProps.path) {
          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }
        return defaultDom;
      }}
      disableContentMargin
      rightContentRender={() =>
        renderRightContent(userConfig, loading, initialState, setInitialState)
      }
      fixSiderbar
      fixedHeader
      {...userConfig}
      {...restProps}
      {...layoutRender}
    >
      <ErrorBoundary>
        <WithExceptionOpChildren currentPathConfig={currentLayoutConfig}>
          {userConfig.childrenRender
            ? userConfig.childrenRender(children)
            : children}
        </WithExceptionOpChildren>
      </ErrorBoundary>
    </ProLayout>
  );
};

export default BasicLayout;
