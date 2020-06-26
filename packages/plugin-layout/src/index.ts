import { IApi, utils } from 'umi';
import { join } from 'path';
import * as allIcons from '@ant-design/icons';
import getLayoutContent from './utils/getLayoutContent';
import { LayoutConfig } from './types';
import { readFileSync, writeFileSync } from 'fs';

const DIR_NAME = 'plugin-layout';

export interface MenuDataItem {
  children?: MenuDataItem[];
  routes?: MenuDataItem[];
  hideChildrenInMenu?: boolean;
  hideInMenu?: boolean;
  icon?: string;
  locale?: string;
  name?: string;
  key?: string;
  path?: string;
  [key: string]: any;
}

function haveProLayout() {
  try {
    require.resolve('@ant-design/pro-layout');
    return true;
  } catch (error) {
    console.log(error);
    console.error('@umijs/plugin-layout 需要安装 ProLayout 才可运行');
  }
  return false;
}

function toHump(name: string) {
  return name.replace(/\-(\w)/g, function(all, letter) {
    return letter.toUpperCase();
  });
}

function formatter(data: MenuDataItem[]): string[] {
  if (!Array.isArray(data)) {
    return [];
  }
  let icons: string[] = [];
  (data || []).forEach((item = { path: '/' }) => {
    // 兼容旧的写法 menu:{icon:""}
    if (item.menu) {
      item = { ...item, ...item.menu };
    }
    if (item.icon) {
      const { icon } = item;
      const v4IconName = toHump(icon.replace(icon[0], icon[0].toUpperCase()));
      if (allIcons[icon]) {
        icons.push(icon);
      }
      if (allIcons[`${v4IconName}Outlined`]) {
        icons.push(`${v4IconName}Outlined`);
      }
    }
    const items = item.routes || item.children;
    if (items) {
      icons = icons.concat(formatter(items));
    }
  });

  return Array.from(new Set(icons));
}

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

  api.modifyDefaultConfig(config => {
    // @ts-ignore
    config.title = false;
    return config;
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
      // 如果 ProLayout 没有安装会提供一个报错和一个空的 layout 组件
      PRO: utils.winPath(
        join(
          __dirname,
          haveProLayout() ? './layout/index.js' : './layout/blankLayout.js',
        ),
      ),
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

    // 生效临时的 icon 文件
    const { userConfig } = api;
    const icons = formatter(userConfig.routes);
    let iconsString = icons.map(
      iconName => `import ${iconName} from '@ant-design/icons/${iconName}'`,
    );
    api.writeTmpFile({
      path: join(DIR_NAME, 'icons.ts'),
      content: `
  ${iconsString.join(';\n')}
  export default {
    ${icons.join(',\n')}
  }
      `,
    });

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
