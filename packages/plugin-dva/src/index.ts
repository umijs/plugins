import { IApi } from 'umi';
import { basename, extname, join } from 'path';
import { readFileSync } from 'fs';
import { getModels } from './getModels/getModels';

export default (api: IApi) => {
  const {
    paths,
    utils: { Mustache, lodash, winPath },
  } = api;

  function getBase() {
    return join(paths.absSrcPath!, api.config.singular ? 'model' : 'models');
  }

  // 配置
  api.describe({
    config: {
      schema(joi) {
        return joi.object();
      },
    },
  });

  // 生成临时文件
  api.onGenerateFiles(() => {
    const dvaTpl = readFileSync(winPath(join(__dirname, 'dva.tpl')), 'utf-8');
    const base = getBase();
    const models = getModels({
      base,
    }).map(p => winPath(join(base, p)));
    api.writeTmpFile({
      content: Mustache.render(dvaTpl, {
        ExtendDvaConfig: '',
        EnhanceApp: '',
        RegisterPlugins: '',
        RegisterModels: models
          .map(path => {
            // prettier-ignore
            return `
app.model({ namespace: '${basename(path, extname(path))}', ...(require('${path}').default) });
          `.trim();
          })
          .join('\r\n'),
        dvaLoadingPath: winPath(require.resolve('dva-loading')),
      }),
      path: 'plugin-dva/dva.ts',
    });
  });
  api.addTmpGenerateWatcherPaths(() => [getBase()]);

  // Babel Plugin for HMR
  api.modifyBabelOpts(babelOpts => {
    const hmr = (api.config as any).dva?.hmr;
    if (hmr) {
      const hmrOpts = lodash.isPlainObject(hmr) ? hmr : {};
      babelOpts.plugins.push([
        require.resolve('babel-plugin-dva-hmr'),
        hmrOpts,
      ]);
    }
    return babelOpts;
  });

  // Runtime Plugin
  api.addRuntimePlugin(() => winPath(join(__dirname, '../lib/runtime.js')));
  api.addRuntimePluginKey(() => 'dva');

  // Modify entry js
  api.addEntryCodeAhead(() =>
    `require('@@/plugin-dva/dva')._onCreate();`.trim(),
  );
};
