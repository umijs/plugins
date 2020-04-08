import { IApi } from 'umi';
import { readFileSync } from 'fs';

export default (api: IApi) => {
  // @ts-ignore
  if (!api.addDevScripts) {
    throw new Error('Need umi 3.1+ to run this plugin.');
  }

  api.describe({
    key: 'devExternals',
    config: {
      schema(joi) {
        return joi
          .array()
          .items(joi.string().valid(...Object.keys(EXTERNALS_MAP)));
      },
    },
    enableBy() {
      return api.env === 'development';
    },
  });

  // @ts-ignore
  api.addDevScripts(() => {
    return (api.config.devExternals || []).map(key => {
      return EXTERNALS_MAP[key].getContent();
    });
  });

  api.modifyBundleConfig(memo => {
    memo.externals = (api.config.devExternals || []).reduce((memo, key) => {
      memo[key] = EXTERNALS_MAP[key].external;
      return memo;
    }, memo.externals || {});
    return memo;
  });
};

const EXTERNALS_MAP = {
  react: {
    getContent() {
      return readFileSync(
        require.resolve('react/umd/react.development.js'),
        'utf-8',
      );
    },
    external: 'window.React',
  },
  'react-dom': {
    getContent() {
      return readFileSync(
        require.resolve('react-dom/umd/react-dom.development.js'),
        'utf-8',
      );
    },
    external: 'window.ReactDOM',
  },
};
