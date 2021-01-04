import { IApi } from 'umi';
import { join } from 'path';
import { readFileSync, existsSync } from 'fs';

export default (api: IApi) => {
  const hasJsxRuntime = (() => {
    try {
      require.resolve('react/jsx-runtime');
      return true;
    } catch (e) {
      return false;
    }
  })();

  api.onStart(() => {
    const tsconfigPath = join(api.cwd, 'tsconfig.json');
    let tsconfigContent = '';
    try {
      if (existsSync(tsconfigPath)) {
        tsconfigContent = readFileSync(tsconfigPath, 'utf-8');
      }
    } catch (e) {}

    if (hasJsxRuntime && !tsconfigContent?.includes('react-jsx')) {
      api.logger.warn(
        '[WARN] update `jsx: "react"` into `jsx: "react-jsx"` to suport the new JSX transform in tsconfig.json',
      );
    }
  });

  api.modifyBabelPresetOpts((opts) => {
    return {
      ...opts,
      react: {
        ...(opts.react || {}),
        reactRequire: !hasJsxRuntime,
        // support the new JSX transform
        runtime: hasJsxRuntime ? 'automatic' : 'classic',
      },
    };
  });
};
