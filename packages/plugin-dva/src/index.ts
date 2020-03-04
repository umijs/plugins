import { IApi, utils } from 'umi';
import { basename, dirname, extname, join, relative } from 'path';
import { readFileSync } from 'fs';
import { getModels } from './getModels/getModels';

const { Mustache, lodash, winPath } = utils;

export default (api: IApi) => {
  function getModelDir() {
    return api.config.singular ? 'model' : 'models';
  }

  function getSrcModelsPath() {
    return join(api.paths.absSrcPath!, getModelDir());
  }

  function hasDvaDependency() {
    const { dependencies, devDependencies } = api.pkg;
    return dependencies?.dva || devDependencies?.dva;
  }

  // 配置
  api.describe({
    key: 'dva',
    config: {
      schema(joi) {
        return joi.object({
          immer: joi.boolean(),
          hmr: joi.boolean(),
          skipModelValidate: joi.boolean(),
          extraModels: joi.array().items(joi.string()),
        });
      },
    },
  });

  function getAllModels() {
    const srcModelsPath = getSrcModelsPath();
    const baseOpts = {
      skipModelValidate: api.config.skipModelValidate,
      extraModels: api.config.extraModels,
    };
    return [
      ...getModels({
        base: srcModelsPath,
        ...baseOpts,
      }),
      ...getModels({
        base: api.paths.absPagesPath!,
        pattern: `**/${getModelDir()}/**/*.{ts,tsx,js,jsx}`,
        ...baseOpts,
      }),
    ];
  }

  let hasModels = false;

  // 初始检测一遍
  api.onStart(() => {
    hasModels = getAllModels().length > 0;
  });

  // 生成临时文件
  api.onGenerateFiles({
    fn() {
      const models = getAllModels();
      hasModels = models.length > 0;

      // 没有 models 不生成文件
      if (!hasModels) return;

      // dva.ts
      const dvaTpl = readFileSync(join(__dirname, 'dva.tpl'), 'utf-8');
      api.writeTmpFile({
        path: 'plugin-dva/dva.ts',
        content: Mustache.render(dvaTpl, {
          ExtendDvaConfig: '',
          EnhanceApp: '',
          RegisterPlugins: [
            api.config.dva?.immer &&
              `app.use(require('${winPath(require.resolve('dva-immer'))}')());`,
          ]
            .filter(Boolean)
            .join('\n'),
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
    },
    // 要比 preset-built-in 靠前
    // 在内部文件生成之前执行，这样 hasModels 设的值对其他函数才有效
    stage: -1,
  });

  // src/models 下的文件变化会触发临时文件生成
  api.addTmpGenerateWatcherPaths(() => [getSrcModelsPath()]);

  // dva 优先读用户项目的依赖
  api.addProjectFirstLibraries(() => [
    { name: 'dva', path: dirname(require.resolve('dva/package.json')) },
  ]);

  // Babel Plugin for HMR
  api.modifyBabelOpts(babelOpts => {
    const hmr = api.config.dva?.hmr;
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
  api.addRuntimePlugin(() =>
    hasModels ? [join(api.paths.absTmpPath!, 'plugin-dva/runtime.tsx')] : [],
  );
  api.addRuntimePluginKey(() => (hasModels ? ['dva'] : []));

  // 有 dva 依赖时暂不导出
  // TODO: 处理有 dva 依赖的场景
  api.addUmiExports(() =>
    hasModels && !hasDvaDependency()
      ? [
          {
            specifiers: ['connect'],
            source: dirname(require.resolve('dva/package')),
          },
        ]
      : [],
  );

  api.registerCommand({
    name: 'dva',
    fn({ args }) {
      if (args._[0] === 'list' && args._[1] === 'model') {
        const models = getAllModels();
        console.log();
        console.log(utils.chalk.bold('  Models in your project:'));
        console.log();
        models.forEach(model => {
          console.log(`    - ${relative(api.cwd, model)}`);
        });
        console.log();
        console.log(`  Totally ${models.length}.`);
        console.log();
      }
    },
  });
};
