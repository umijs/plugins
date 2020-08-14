import { readFileSync } from 'fs';
import { join, dirname } from 'path';

import { IApi, utils } from 'umi';

const { winPath, Mustache } = utils;

export default (api: IApi) => {
  const helmetPkgPath = winPath(
    dirname(require.resolve('react-helmet/package')),
  );

  api.addDepInfo(() => {
    return [
      {
        name: 'react-helmet',
        range: require('../package.json').dependencies['react-helmet'],
        alias: [helmetPkgPath],
      },
    ];
  });

  api.onGenerateFiles(async () => {
    if (api.config.ssr) {
      const runtimeTpl = join(__dirname, 'templates', 'runtime.tpl');
      const runtimeContent = readFileSync(runtimeTpl, 'utf-8');
      api.writeTmpFile({
        path: 'plugin-helmet/runtime.ts',
        content: Mustache.render(runtimeContent, {
          HelmetPkg: helmetPkgPath,
          SSR: !!api.config.ssr,
        }),
      });
    }

    const exportsTpl = join(__dirname, 'templates', 'exports.tpl');
    const exportsContent = readFileSync(exportsTpl, 'utf-8');
    api.writeTmpFile({
      path: 'plugin-helmet/exports.ts',
      content: Mustache.render(exportsContent, {
        HelmetPkg: helmetPkgPath,
      }),
    });
  });

  api.addRuntimePlugin(() =>
    api.config?.ssr
      ? [winPath(join(api.paths.absTmpPath!, 'plugin-helmet', 'runtime.ts'))]
      : [],
  );

  api.addUmiExports(() => [
    {
      exportAll: true,
      source: '../plugin-helmet/exports',
    },
  ]);
};
