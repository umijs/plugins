import { IApi, utils } from 'umi';
import { join } from 'path';
import { readFileSync, existsSync } from 'fs';

const { semver } = utils;

export default (api: IApi) => {
  const isReact17 = () => {
    let react;
    try {
      react = require(require.resolve('react', { paths: [api.cwd] }));
    } catch (e) {}
    return (
      semver.valid(react?.version) &&
      semver.gte(react.version, '17.0.0-alpha.0')
    );
  };

  api.onStart(() => {
    const tsconfigPath = join(api.cwd, 'tsconfig.json');
    let tsconfigContent = '';
    try {
      if (existsSync(tsconfigPath)) {
        tsconfigContent = readFileSync(tsconfigPath, 'utf-8');
      }
    } catch (e) {}

    if (
      isReact17() &&
      tsconfigContent &&
      !tsconfigContent?.includes('react-jsx')
    ) {
      api.logger.warn(
        '[WARN] update `jsx: "react"` into `jsx: "react-jsx"` to suport the new JSX transform in React 17 in tsconfig.json',
      );
    }
  });

  // support react 17
  api.modifyBabelPresetOpts((opts) => {
    return {
      ...opts,
      reactRequire: !isReact17(),
      react: {
        ...(opts.react || {}),
        // support React 17 New Jsx syntax
        runtime: isReact17() ? 'automatic' : 'classic',
      },
    };
  });
};
