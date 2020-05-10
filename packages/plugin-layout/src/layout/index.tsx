import React, { useMemo, useState, useEffect } from 'react';
// @ts-ignore
import { Link, useModel, history, useIntl, InitialState } from 'umi';
import ProLayout from '@ant-design/pro-layout';
import './style.less';
import ErrorBoundary from '../component/ErrorBoundary';
import useRightContent from './useRightContent';
import { WithExceptionOpChildren } from '../component/Exception';
import { getMatchMenu, MenuDataItem, transformRoute } from '@umijs/route-utils';
// @ts-ignore
import logo from '../assets/logo.svg';

const BasicLayout = (props: any) => {
  const { children, userConfig, location, ...restProps } = props;
  const initialInfo = (useModel && useModel('@@initialState')) || {
    initialState: undefined,
    loading: false,
    setInitialState: null,
  }; // plugin-initial-state 未开启
  const { initialState, loading, setInitialState } = initialInfo;
  // 国际化插件并非默认启动
  const intl = useIntl && useIntl();
  const rightContentRender = useRightContent(
    userConfig,
    loading,
    initialState,
    setInitialState,
  );
  const [currentPathConfig, setCurrentPathConfig] = useState<MenuDataItem>({});

  useEffect(() => {
    const { menuData } = transformRoute(
      props?.route?.routes || [],
      undefined,
      undefined,
      true,
    );
    // 动态路由匹配
    const currentPathConfig = getMatchMenu(location.pathname, menuData).pop();
    setCurrentPathConfig(currentPathConfig || {});
  }, [location.pathname]);
  // layout 是否渲染相关
  const layoutRender: any = {};

  if (currentPathConfig?.layout?.hideMenu) {
    layoutRender.menuRender = false;
  }

  if (currentPathConfig?.layout?.hideNav) {
    layoutRender.headerRender = false;
  }

  if (currentPathConfig?.layout == false) {
    layoutRender.pure = true;
  }

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
      // 支持了一个 patchMenus，其实应该用 menuDataRender
      menuDataRender={
        userConfig.patchMenus
          ? menuData => userConfig.patchMenus(menuData, initialInfo)
          : undefined
      }
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
      rightContentRender={rightContentRender}
      fixSiderbar
      fixedHeader
      {...userConfig}
      {...restProps}
      {...layoutRender}
    >
      <ErrorBoundary>
        <WithExceptionOpChildren currentPathConfig={currentPathConfig}>
          {userConfig.childrenRender
            ? userConfig.childrenRender(children)
            : children}
        </WithExceptionOpChildren>
      </ErrorBoundary>
    </ProLayout>
  );
};

export default BasicLayout;
