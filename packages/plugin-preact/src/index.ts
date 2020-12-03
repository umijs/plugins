import { IApi } from 'umi';
import { dirname, join } from 'path';

export default (api: IApi) => {
  api.chainWebpack(memo => {
    memo.resolve.alias
      .set('preact/devtools', require.resolve('preact/devtools'))
      .set('preact/hooks', require.resolve('preact/hooks'))
      .set('preact', require.resolve('preact'))
      .set('react', dirname(require.resolve('preact/compat/package.json')))
      .set('react-dom', dirname(require.resolve('preact/compat/package.json')))
    return memo;
  });

  api.addEntryImports(() => {
    return process.env.NODE_ENV === 'development'
      ? [
          {
            source: 'preact/devtools',
          },
        ]
      : [];
  });
};
