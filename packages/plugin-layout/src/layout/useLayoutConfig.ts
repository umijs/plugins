import { useState, useEffect } from 'react';
import { IRouteLayoutConfig } from '../types/interface';
import {
  registerSideMenuToggleListener,
  registerNavToggleListener,
  registerFooterToggleListener,
  registerLayoutToggleListener,
} from './effects';

/**
 * 获取用户手动调用相关 api 更改 layout 配置后的当前 layout 配置，以及与 pro-layout 对应的 layout render 配置
 * @param currentLayoutConfig
 */
function useLayoutConfig(currentLayoutConfig: IRouteLayoutConfig | undefined) {
  const [layoutConfig, setLayoutConfig] = useState(currentLayoutConfig);

  useEffect(() => {
    const unRegisterSideMenuToggleListener = registerSideMenuToggleListener(
      visible =>
        setLayoutConfig({
          ...layoutConfig,
          hideMenu: !visible,
        }),
    );

    const unRegisterNavToggleListener = registerNavToggleListener(visible =>
      setLayoutConfig({
        ...layoutConfig,
        hideNav: !visible,
      }),
    );

    const unRegisterFooterToggleListener = registerFooterToggleListener(
      visible =>
        setLayoutConfig({
          ...layoutConfig,
          hideFooter: !visible,
        }),
    );

    const unRegisterLayoutToggleListener = registerLayoutToggleListener(
      visible =>
        setLayoutConfig({
          ...layoutConfig,
          hideLayout: !visible,
        }),
    );
    return () => {
      unRegisterSideMenuToggleListener();
      unRegisterNavToggleListener();
      unRegisterFooterToggleListener();
      unRegisterLayoutToggleListener();
    };
  }, []);

  // 将当前 layout 配置转换成 pro-layout 组件对应的配置项
  const layoutRender: any = {};
  if (layoutConfig?.hideMenu) {
    layoutRender.menuRender = false;
  }
  if (layoutConfig?.hideNav) {
    layoutRender.headerRender = false;
  }
  if (layoutConfig?.hideLayout) {
    layoutRender.pure = true;
  }
  if (layoutConfig?.hideFooter) {
    layoutRender.footerRender = false;
  }

  return [layoutConfig, layoutRender];
}

export default useLayoutConfig;
