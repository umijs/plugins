/**
 * 注册部分布局隐藏/显示的 listener，用于监听用户侧触发的切换部分布局是否显示的事件
 * @param callback
 */
function registerToggleListener(
  eventType: string,
  callback: (display: boolean) => void,
) {
  function toggleDisplayListener(event: Event) {
    callback((event as CustomEvent).detail.visible);
  }

  window.addEventListener(eventType, toggleDisplayListener);

  return () => window.removeEventListener(eventType, toggleDisplayListener);
}

/**
 * 注册侧边栏是否显示的事件
 * @param callback
 */
export function registerSideMenuToggleListener(
  callback: (display: boolean) => void,
) {
  const eventType = 'plugin-layout: toggle-sideMenu';

  return registerToggleListener(eventType, callback);
}

/**
 * 注册导航是否显示的事件
 * @param callback
 */
export function registerNavToggleListener(
  callback: (display: boolean) => void,
) {
  const eventType = 'plugin-layout: toggle-nav';

  return registerToggleListener(eventType, callback);
}

/**
 * 注册 footer 是否显示的事件
 * @param callback
 */
export function registerFooterToggleListener(
  callback: (display: boolean) => void,
) {
  const eventType = 'plugin-layout: toggle-footer';

  return registerToggleListener(eventType, callback);
}

/**
 * 注册 layout 是否显示的事件
 * @param callback
 */
export function registerLayoutToggleListener(
  callback: (display: boolean) => void,
) {
  const eventType = 'plugin-layout: toggle-layout';

  return registerToggleListener(eventType, callback);
}
