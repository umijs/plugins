import { IApi, utils } from 'umi';
import { join } from 'path';
import getLayoutContent from './utils/getLayoutContent';
import { LayoutConfig } from './types';
import { readFileSync } from 'fs';

const DIR_NAME = 'plugin-layout';

export default (api: IApi) => {
  api.describe({
    key: 'layout',
    config: {
      schema(joi) {
        return joi.object();
      },
      onChange: api.ConfigChangeType.regenerateTmpFiles,
    },
    enableBy: api.EnableBy.config,
  });

  let layoutOpts: LayoutConfig = {};

  api.addRuntimePluginKey(() => ['layout']);

  api.onGenerateFiles(() => {
    // apply default options
    const { name } = api.pkg;
    layoutOpts = {
      name,
      theme: 'PRO',
      locale: false,
      showBreadcrumb: true,
      ...(api.config.layout || {}),
    };

    // allow custom theme
    let layoutComponent = {
      PRO: utils.winPath(join(__dirname, './layout/index.js')),
    };
    if (layoutOpts.layoutComponent) {
      layoutComponent = Object.assign(
        layoutOpts.layoutComponent,
        layoutComponent,
      );
    }

    const theme = (layoutOpts.theme && layoutOpts.theme.toUpperCase()) || 'PRO';
    const currentLayoutComponentPath =
      layoutComponent[theme] || layoutComponent['PRO'];

    api.writeTmpFile({
      path: join(DIR_NAME, 'Layout.tsx'),
      content: getLayoutContent(layoutOpts, currentLayoutComponentPath),
    });

    // TODO: 修改 icon 的加载为按需
    // 用文件生成的方式，方便之后修改 icon 为按需
    api.writeTmpFile({
      path: join(DIR_NAME, 'runtime.tsx'),
      content: readFileSync(join(__dirname, 'runtime.tsx.tpl'), 'utf-8'),
    });
  });

  api.modifyRoutes(routes => {
    return [
      {
        path: '/',
        component: utils.winPath(
          join(api.paths.absTmpPath || '', DIR_NAME, 'Layout.tsx'),
        ),
        routes,
      },
    ];
  });

  api.addRuntimePlugin(() => ['@@/plugin-layout/runtime.tsx']);
};
