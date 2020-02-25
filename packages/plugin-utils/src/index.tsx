import { IApi } from 'umi';

export default function(api: IApi) {
  const {
    utils: { winPath },
  } = api;

  const namespace = 'plugin-utils';

  api.onGenerateFiles(() => {
    try {
      api.writeTmpFile({
        path: `${namespace}/utils.ts`,
        content: `
        import _ from '${winPath(require.resolve('lodash'))}';
        import moment from '${winPath(require.resolve('moment'))}';
        import classnames from '${winPath(require.resolve('classnames'))}';
        import debug from '${winPath(require.resolve('debug'))}';
        import jsCookie from '${winPath(require.resolve('js-cookie'))}';
        import queryString from '${winPath(require.resolve('query-string'))}';
        import ReactHelmet from '${winPath(require.resolve('react-helmet'))}';

        export {
          _,
          moment,
          classnames,
          debug,
          jsCookie,
          queryString,
          ReactHelmet,
        };
        `,
      });
    } catch (e) {
      api.logger.error(e);
    }
  });

  api.addUmiExports(() => {
    return [
      {
        exportAll: true,
        source: `../${namespace}/utils`,
      },
    ];
  });
}
