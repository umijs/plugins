import { readFileSync } from 'fs';
import { join, dirname } from 'path';

import { IApi, utils } from 'umi';

const { winPath, Mustache } = utils;

export default (api: IApi) => {
  const helmetPkgPath = winPath(
    dirname(require.resolve('react-helmet/package')),
  );
  api.onGenerateFiles(async () => {
    const runtimeTpl = join(__dirname, 'templates', 'runtime.tpl');
    const runtimeContent = readFileSync(runtimeTpl, 'utf-8');
    api.writeTmpFile({
      path: 'plugin-helmet/runtime.ts',
      content: Mustache.render(runtimeContent, {
        HelmetPkg: helmetPkgPath,
        SSR: !!api.config.ssr,
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
