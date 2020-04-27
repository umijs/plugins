import { readFileSync } from 'fs';
import { join } from 'path';

import { IApi, utils } from 'umi';

const { winPath, Mustache } = utils;

export default (api: IApi) => {
  const helmetPkgPath = winPath(require.resolve('react-helmet-async'));
  api.onGenerateFiles(async () => {
    const runtimeTpl = join(winPath(__dirname), 'templates', 'runtime.tpl');
    const runtimeContent = readFileSync(runtimeTpl, 'utf-8');
    api.writeTmpFile({
      path: 'plugin-helmet/runtime.ts',
      content: Mustache.render(runtimeContent, {
        HelmetPkg: helmetPkgPath,
        SSR: !!api.config.ssr,
        Utils: winPath(require.resolve('./utils')),
      }),
    });
  });

  api.addRuntimePlugin(() =>
    winPath(join(api.paths!.absTmpPath, 'plugin-helmet', 'runtime.ts')),
  );

  api.addUmiExports(() => [
    {
      exportAll: true,
      source: helmetPkgPath,
    },
  ]);
};
