import { IApi } from 'umi';
import { basename, dirname, extname, join } from 'path';
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
        return joi.alternatives(joi.object(), joi.boolean());
      },
    },
  });

  // 生成临时文件
  api.onGenerateFiles(() => {
    // dva.ts
    const dvaTpl = readFileSync(join(__dirname, 'dva.tpl'), 'utf-8');
    const base = getBase();
    const models = getModels({
      base,
    }).map(p => winPath(join(base, p)));
    api.writeTmpFile({
      path: 'plugin-dva/dva.ts',
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
        // use esm version
        dvaLoadingPkgPath: winPath(
          require.resolve('dva-loading/dist/index.esm.js'),
        ),
      }),
    });

    // runtime.tsx
    const runtimeTpl = readFileSync(join(__dirname, 'runtime.tpl'), 'utf-8');
    api.writeTmpFile({
      path: 'plugin-dva/runtime.tsx',
      content: Mustache.render(runtimeTpl, {}),
    });
  });
  api.addTmpGenerateWatcherPaths(() => [getBase()]);

  api.addProjectFirstLibraries(() => [
    { name: 'dva', path: dirname(require.resolve('dva/package.json')) },
  ]);

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
  api.addRuntimePlugin(() => join(paths.absTmpPath!, 'plugin-dva/runtime.tsx'));
  api.addRuntimePluginKey(() => 'dva');

  // Modify entry js
  api.addEntryCodeAhead(() =>
    `require('./plugin-dva/dva')._onCreate();`.trim(),
  );
};
