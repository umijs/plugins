import { dirname, join } from 'path';
import { IApi, utils } from 'umi';
import semver from 'semver';

const { winPath, resolve } = utils;

export default (api: IApi) => {
  api.describe({
    key: 'hd',
    config: {
      schema(Joi) {
        return Joi.object({});
      },
    },
  });
  api.chainWebpack((memo) => {
    function getUserAntdMobileDir() {
      if (
        // @ts-ignore
        (api.pkg.dependencies && api.pkg.dependencies['antd-mobile']) ||
        // @ts-ignore
        (api.pkg.devDependencies && api.pkg.devDependencies['antd-mobile']) ||
        // egg project using `clientDependencies` in ali tnpm
        // @ts-ignore
        (api.pkg.clientDependencies &&
          api.pkg.clientDependencies['antd-mobile'])
      ) {
        let version = '5.0.0-rc.2';
        try {
          version =
            require(`${api.paths.absNodeModulesPath}/antd-mobile/package.json`).version;
        } catch (error) {}
        if (semver.gt('5.0.0-alpha.0', version)) return;
        return winPath(
          join(
            dirname(
              // 通过 resolve 往上找，可支持 lerna 仓库
              // lerna 仓库如果用 yarn workspace 的依赖不一定在 node_modules，可能被提到根目录，并且没有 link
              resolve.sync(`antd-mobile/package.json`, {
                basedir: api.paths.cwd,
              }),
            ),
            api.userConfig.hd ? '2x' : '',
          ),
        );
      }
      return null;
    }
    //如果项目中安装的是 antd-mobile@5 优先使用用户项目中安装的 antd-mobile，否则忽略用户安装，强制指定 mobile@5 版本
    memo.resolve.alias.set(
      'antd-mobile',
      getUserAntdMobileDir() ||
        winPath(
          join(
            dirname(require.resolve('antd-mobile/package.json')),
            api.userConfig.hd ? '2x' : '',
          ),
        ),
    );
    return memo;
  });
};
