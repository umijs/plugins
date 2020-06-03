function genCustomEventDetail(detail: any) {
  return { detail };
}

function genCustomEvent(eventName: string, eventDetail: any) {
  return new CustomEvent(eventName, genCustomEventDetail(eventDetail));
}

export function hideMenu() {
   window.dispatchEvent(genCustomEvent('plugin-layout: toggle-sideMenu', { visible: false }));
}

export function showMenu() {
   window.dispatchEvent(genCustomEvent('plugin-layout: toggle-sideMenu', { visible: true }));
}


export function hideNav() {
  window.dispatchEvent(genCustomEvent('plugin-layout: toggle-nav', { visible: false }));
}

export function showNav() {
  window.dispatchEvent(genCustomEvent('plugin-layout: toggle-nav', { visible: true }));
}

export function hideFooter() {
  window.dispatchEvent(genCustomEvent('plugin-layout: toggle-footer', { visible: false }));
}

export function showFooter() {
  window.dispatchEvent(genCustomEvent('plugin-layout: toggle-footer', { visible: true }));
}

export function hideLayout() {
  window.dispatchEvent(genCustomEvent('plugin-layout: toggle-layout', { visible: false }));
}

export function showLayout() {
  window.dispatchEvent(genCustomEvent('plugin-layout: toggle-layout', { visible: true }));
}
