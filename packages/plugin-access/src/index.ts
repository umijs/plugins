import { IApi } from 'umi';
import { join } from 'path';
import getContextContent from './utils/getContextContent';
import getAccessProviderContent from './utils/getAccessProviderContent';
import getAccessContent from './utils/getAccessContent';
import getRootContainerContent from './utils/getRootContainerContent';
import { checkIfHasDefaultExporting } from './utils';

const ACCESS_DIR = 'plugin-access'; // plugin-access 插件创建临时文件的专有文件夹

export default function (api: IApi) {
  const umiTmpDir = api.paths.absTmpPath;
  const srcDir = api.paths.absSrcPath;
  const accessFilePath = api.utils.winPath(join(srcDir!, 'access'));
  // 判断 access 工厂函数存在并且 default 暴露了一个函数
  const hasSrcAccessFile = checkIfHasDefaultExporting(accessFilePath);
  const accessFactoryPath = hasSrcAccessFile
    ? '@/access'
    : `@@/${ACCESS_DIR}/accessFactory`;

  api.onGenerateFiles(() => {
    if (!hasSrcAccessFile) {
      // 创建默认的 access 文件，保证 access 功能可用
      api.writeTmpFile({
        path: `${ACCESS_DIR}/accessFactory.ts`,
        content: `export default function() { return { }; }`,
      });
    }
    // 创建 access 的 context 以便跨组件传递 access 实例
    api.writeTmpFile({
      path: `${ACCESS_DIR}/context.ts`,
      content: getContextContent(accessFactoryPath),
    });

    // 创建 AccessProvider，1. 生成 access 实例; 2. 遍历修改 routes; 3. 传给 context 的 Provider
    api.writeTmpFile({
      path: `${ACCESS_DIR}/AccessProvider.ts`,
      content: getAccessProviderContent(api.utils, accessFactoryPath),
    });

    // 创建 access 的 hook
    api.writeTmpFile({
      path: `${ACCESS_DIR}/access.tsx`,
      content: getAccessContent(api.utils),
    });

    // 生成 rootContainer 运行时配置
    api.writeTmpFile({
      path: `${ACCESS_DIR}/rootContainer.ts`,
      content: getRootContainerContent(),
    });
  });

  // 增加 rootContainer 运行时配置
  api.addRuntimePlugin(() =>
    api.utils.winPath(join(umiTmpDir!, ACCESS_DIR, 'rootContainer.ts')),
  );

  api.addUmiExports(() => [
    {
      exportAll: true,
      source: `../${ACCESS_DIR}/access`,
    },
  ]);

  if (hasSrcAccessFile) {
    api.addTmpGenerateWatcherPaths(() => [
      `${accessFilePath}.ts`,
      `${accessFilePath}.js`,
    ]);
  }
}
