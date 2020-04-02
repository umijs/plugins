import { getExportProps } from '@umijs/ast';
import { IApi, utils } from 'umi';
import { basename, dirname, extname, join, relative } from 'path';
import { readFileSync } from 'fs';
import { getModels } from './getModels/getModels';
import { getUserLibDir } from './getUserLibDir';

const { Mustache, lodash, winPath } = utils;

export default (api: IApi) => {
  const { logger } = api;

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
      skipModelValidate: api.config.dva?.skipModelValidate,
      extraModels: api.config.dva?.extraModels,
    };
    return lodash.uniq([
      ...getModels({
        base: srcModelsPath,
        ...baseOpts,
      }),
      ...getModels({
        base: api.paths.absPagesPath!,
        pattern: `**/${getModelDir()}/**/*.{ts,tsx,js,jsx}`,
        ...baseOpts,
      }),
      ...getModels({
        base: api.paths.absPagesPath!,
        pattern: `**/model.{ts,tsx,js,jsx}`,
        ...baseOpts,
      }),
    ]);
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

      logger.debug('dva models:');
      logger.debug(models);

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

      // exports.ts
      const exportsTpl = readFileSync(join(__dirname, 'exports.tpl'), 'utf-8');
      const dvaLibPath = winPath(
        getUserLibDir({
          library: 'dva',
          pkg: api.pkg,
          cwd: api.cwd,
        }) || dirname(require.resolve('dva/package.json')),
      );
      const dvaVersion = require(join(dvaLibPath, 'package.json')).version;
      const exportMethods = dvaVersion.startsWith('2.6')
        ? ['connect', 'useDispatch', 'useStore', 'useSelector']
        : ['connect'];

      logger.debug(`dva lib path: ${dvaLibPath}`);
      logger.debug(`dva version: ${dvaVersion}`);
      logger.debug(`exported methods:`);
      logger.debug(exportMethods);

      api.writeTmpFile({
        path: 'plugin-dva/exports.ts',
        content: Mustache.render(exportsTpl, {
          dvaLibPath,
          exportMethods: exportMethods.join(', '),
        }),
      });

      // typings
      const usedModalKeyCount = new Map<string, number>();
      const modelExports = models.map(path => {
        let effects: string[] = [];
        let reducers: string[] = [];
        let namespace = basename(path, extname(path));
        const pathWithoutExt = `${dirname(path)}/${namespace}`;

        const exportsProps = getExportProps(readFileSync(path, 'utf-8')) as any;
        if (lodash.isPlainObject(exportsProps)) {
          if (typeof exportsProps.namespace === 'string')
            namespace = exportsProps.namespace;
          if (lodash.isPlainObject(exportsProps.effects))
            effects = Object.keys(exportsProps.effects);
          if (lodash.isPlainObject(exportsProps.reducers))
            reducers = Object.keys(exportsProps.reducers);
        }

        const namespaceInPascalCase = `${namespace[0].toUpperCase()}${lodash.camelCase(
          namespace.slice(1),
        )}`.replace(/[^a-zA-Z0-9]/g, '');
        let key = `Model${namespaceInPascalCase}`;
        const sameKeyCount = usedModalKeyCount.get(key) || 0;
        if (sameKeyCount) key = `${key}${sameKeyCount}`;
        usedModalKeyCount.set(key, sameKeyCount + 1);

        return {
          key,
          effects,
          reducers,
          namespace,
          pathWithoutExt: winPath(pathWithoutExt),
        };
      });
      const connectTpl = readFileSync(join(__dirname, 'connect.tpl'), 'utf-8');
      api.writeTmpFile({
        path: 'plugin-dva/connect.ts',
        content: Mustache.render(connectTpl, {
          dvaHeadImport: modelExports
            .map(({ key, pathWithoutExt }) => {
              return `import { default as ${key} } from '${pathWithoutExt}';`;
            })
            .join('\r\n'),
          dvaHeadExport: modelExports
            .map(({ pathWithoutExt }) => `export * from '${pathWithoutExt}';`)
            .join('\r\n'),
          dvaLoadingModels: modelExports
            .map(({ namespace }) => `  '${namespace}'?: boolean;`)
            .join('\r\n'),
          dvaEffectsMap: modelExports
            .reduce<string[]>((prev, { effects, namespace, key }) => {
              if (!effects) return prev;
              const effectsMap = effects.map(effect => {
                return `  '${namespace}/${effect}': PickEffectAction<typeof ${key}, '${effect}'>;`;
              });
              return prev.concat(effectsMap);
            }, [])
            .join('\r\n'),
          dvaReducersMap: modelExports
            .reduce<string[]>((prev, { reducers, namespace, key }) => {
              if (!reducers) return prev;
              const effectsMap = reducers.map(reducer => {
                return `  '${namespace}/${reducer}': PickReducerAction<typeof ${key}, '${reducer}'>;`;
              });
              return prev.concat(effectsMap);
            }, [])
            .join('\r\n'),
        }),
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

  // 导出内容
  api.addUmiExports(() =>
    hasModels
      ? [
          {
            exportAll: true,
            source: '../plugin-dva/exports',
          },
          {
            exportAll: true,
            source: '../plugin-dva/connect',
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
