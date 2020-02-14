import { IApi } from 'umi';
import { join } from 'path';
import getContextContent from './utils/getContextContent';
import getAccessProviderContent from './utils/getAccessProviderContent';
import getAccessContent from './utils/getAccessContent';
import getRootContainerContent from './utils/getRootContainerContent';
import { checkIfHasDefaultExporting } from './utils';

const ACCESS_DIR = 'plugin-access'; // plugin-access 插件创建临时文件的专有文件夹

export interface Options {
  showWarning: boolean; // 表明插件本身是否检测调用合法性并给出警告
}

const defaultOptions: Options = { showWarning: true };

export default function(api: IApi, opts: Options = defaultOptions) {
  const umiTmpDir = api.paths.absTmpPath;
  const srcDir = api.paths.absSrcPath;
  const accessFilePath = api.utils.winPath(join(srcDir!, 'access'));

  api.onGenerateFiles(() => {
    // 判断 access 工厂函数存在并且 default 暴露了一个函数
    if (checkIfHasDefaultExporting(accessFilePath)) {
      // 创建 access 的 context 以便跨组件传递 access 实例
      api.writeTmpFile({
        path: `${ACCESS_DIR}/context.ts`,
        content: getContextContent(),
      });

      // 创建 AccessProvider，1. 生成 access 实例; 2. 遍历修改 routes; 3. 传给 context 的 Provider
      api.writeTmpFile({
        path: `${ACCESS_DIR}/AccessProvider.ts`,
        content: getAccessProviderContent(),
      });

      // 创建 access 的 hook
      api.writeTmpFile({
        path: `${ACCESS_DIR}/access.tsx`,
        content: getAccessContent(),
      });

      // 生成 rootContainer 运行时配置
      api.writeTmpFile({
        path: `${ACCESS_DIR}/rootContainer.ts`,
        content: getRootContainerContent(),
      });
    } else {
      if (opts.showWarning) {
        api.logger.warn(
          `[plugin-access]: access.js or access.ts file should be defined at srcDir and default exporting a factory function.`,
        );
      }
    }
  });

  // * api.register() 不能在初始化之后运行
  if (checkIfHasDefaultExporting(accessFilePath)) {
    // 增加 rootContainer 运行时配置
    // TODO: eliminate this workaround
    api.addRuntimePlugin(() =>
      api.utils.winPath(join(umiTmpDir!, ACCESS_DIR, 'rootContainer.ts')),
    );

    api.addUmiExports(() => [
      {
        exportAll: true,
        source: `../${ACCESS_DIR}/access`,
      },
    ]);

    api.addTmpGenerateWatcherPaths(() => [
      `${accessFilePath}.ts`,
      `${accessFilePath}.js`,
    ]);
  }
}
