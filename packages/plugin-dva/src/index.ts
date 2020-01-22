import { IApi } from 'umi';
import { basename, extname, join } from 'path';
import { readFileSync } from 'fs';
import { getModels } from './getModels/getModels';

interface IOpts {
  hmr?: object | boolean;
}

export default (api: IApi, opts: IOpts = {}) => {
  const {
    paths,
    utils: { Mustache, lodash, winPath },
  } = api;

  function getBase() {
    return join(paths.absSrcPath!, api.config.singular ? 'model' : 'models');
  }

  // 生成临时文件
  api.onGenerateFiles(() => {
    const dvaTpl = readFileSync(join(__dirname, 'dva.tpl'), 'utf-8');
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
      }),
      path: 'plugin-dva/dva.ts',
    });
  });

  // Babel Plugin for HMR
  api.modifyBabelOpts(babelOpts => {
    if (opts.hmr) {
      babelOpts.plugins.push([
        require.resolve('babel-plugin-dva-hmr'),
        opts.hmr,
      ]);
    }
    return babelOpts;
  });

  // Runtime Plugin
  api.addRuntimePlugin(() => join(__dirname, '../src/runtime.tsx'));
  api.addRuntimePluginKey(() => 'dva');

  // Modify entry js
  api.addEntryCodeAhead(() =>
    `require('@@/plugin-dva/dva')._onCreate();`.trim(),
  );

  api.addTmpGenerateWatcherPaths(() => [getBase()]);
};
