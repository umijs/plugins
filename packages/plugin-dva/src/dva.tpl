import { Component } from 'react';
import { ApplyPluginsType } from 'umi';
import dva from 'dva';
import createLoading from '{{{ dvaLoadingPkgPath }}}';
import { plugin, history } from '../core/umiExports';

let app = null;

export function _onCreate() {
  const runtimeDva = plugin.applyPlugins({
    key: 'dva',
    type: ApplyPluginsType.modify,
    initialValue: {},
  });
  app = dva({
    history,
    {{{ ExtendDvaConfig }}}
    ...(runtimeDva.config || {}),
    ...(window.g_useSSR ? { initialState: window.g_initialData } : {}),
  });
  {{{ EnhanceApp }}}
  app.use(createLoading());
  {{{ RegisterPlugins }}}
  (runtimeDva.plugins || []).forEach(plugin => {
    app.use(plugin);
  });
  {{{ RegisterModels }}}
  return app;
}

export function getApp() {
  return app;
}

export class _DvaContainer extends Component {
  render() {
    const app = getApp();
    app.router(() => this.props.children);
    return app.start()();
  }
}
