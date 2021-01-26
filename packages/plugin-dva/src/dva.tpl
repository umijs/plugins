import { Component } from 'react';
import { ApplyPluginsType } from 'umi';
import dva from 'dva';
// @ts-ignore
import createLoading from '{{{ dvaLoadingPkgPath }}}';
import { plugin, history } from '../core/umiExports';
{{ #dvaImmer }}
import dvaImmer, { enableES5 } from '{{{ dvaImmerPath }}}';
{{ /dvaImmer }}

let app:any = null;

export async function _onCreate(options = {}) {
  const runtimeDva = plugin.applyPlugins({
    key: 'dva',
    type: ApplyPluginsType.modify,
    initialValue: {},
  });
  app = dva({
    history,
    {{{ ExtendDvaConfig }}}
    ...(runtimeDva.config || {}),
    // @ts-ignore
    ...(typeof window !== 'undefined' && window.g_useSSR ? { initialState: window.g_initialProps } : {}),
    ...(options || {}),
  });
  {{{ EnhanceApp }}}
  app.use(createLoading());
  {{ #dvaImmer }}
  app.use(dvaImmer());
  {{ /dvaImmer }}
  {{ #dvaImmerES5 }}
  enableES5();
  {{ /dvaImmerES5 }}
  (runtimeDva.plugins || []).forEach((plugin:any) => {
    app.use(plugin);
  });
  {{{ RegisterModelImports }}}
  {{{ RegisterModels }}}
  return app;
}

export function getApp() {
  return app;
}


