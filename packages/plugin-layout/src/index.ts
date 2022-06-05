import { IApi, utils } from 'umi';
import { join } from 'path';
import * as allIcons from '@ant-design/icons';
import getLayoutContent, {
  genRenderRightContent,
} from './utils/getLayoutContent';
import copySrcFiles from './utils/copySrcFiles';
import { LayoutConfig } from './types';
import { readFileSync, existsSync } from 'fs';

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
  return name.replace(/\-(\w)/g, function (all, letter) {
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

  api.addDepInfo(() => {
    const pkg = require('../package.json');
    return [
      {
        name: '@ant-design/pro-layout',
        range:
          api.pkg.dependencies?.['@ant-design/pro-layout'] ||
          api.pkg.devDependencies?.['@ant-design/pro-layout'] ||
          pkg.peerDependencies['@ant-design/pro-layout'],
      },
      {
        name: '@umijs/route-utils',
        range: pkg.dependencies['@umijs/route-utils'],
      },
      {
        name: '@ant-design/icons',
        range: pkg.peerDependencies['@ant-design/icons'],
      },
    ];
  });
  const accessPath = join(api.paths.absTmpPath!, 'plugin-access', 'access.tsx');
  let generatedOnce = false;
  api.onGenerateFiles({
    fn() {
      if (generatedOnce) return;
      generatedOnce = true;
      const cwd = join(__dirname, '../src');
      const config = { hasAccess: existsSync(accessPath) };
      copySrcFiles({ cwd, absTmpPath: api.paths.absTmpPath!, config });
    },
    // 在其他文件生成之后，再执行
    stage: 99,
  });

  api.modifyDefaultConfig((config) => {
    // @ts-ignore
    config.title = false;
    
    // layout/style.less 依赖 antd 的变量表，此处注入预置 less 变量
    // 用于兼容 antd@4.17.0 后的版本，因为 es/style/themes/default.less 依赖 @root-entry-name
    // 不直接用 dist/antd.variable.less 是为了兼容之前的版本
    config.theme ??= {};
    config.theme['root-entry-name'] = 'variable';
    
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
      PRO: haveProLayout()
        ? './layout/layout/index.tsx'
        : './layout/layout/blankLayout.tsx',
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

    const layoutExportsContent = readFileSync(
      join(__dirname, 'layoutExports.ts.tpl'),
      'utf-8',
    );
    api.writeTmpFile({
      path: 'plugin-layout/layoutExports.ts',
      content: utils.Mustache.render(layoutExportsContent, {}),
    });

    api.writeTmpFile({
      path: 'plugin-layout/renderRightContent.tsx',
      content: genRenderRightContent({
        locale: api.hasPlugins(['@umijs/plugin-locale']),
        initialState: api.hasPlugins(['@umijs/plugin-initial-state']),
      }),
    });

    api.writeTmpFile({
      path: join(DIR_NAME, 'Layout.tsx'),
      content: getLayoutContent(
        layoutOpts,
        currentLayoutComponentPath,
        api.hasPlugins(['@umijs/plugin-locale']),
        existsSync(accessPath),
      ),
    });

    // 生效临时的 icon 文件
    const { userConfig } = api;
    const icons = formatter(userConfig.routes);
    let iconsString = icons.map(
      (iconName) =>
        `import ${iconName} from '@ant-design/icons/es/icons/${iconName}'`,
    );
    api.writeTmpFile({
      path: join(DIR_NAME, 'icons.ts'),
      content: `
  ${iconsString.join(';\n')}
  export default {
    ${icons.join(',\n')}
  }`,
    });

    api.writeTmpFile({
      path: join(DIR_NAME, 'runtime.tsx'),
      content: readFileSync(join(__dirname, 'runtime.tsx.tpl'), 'utf-8'),
    });
  });

  api.modifyRoutes((routes) => {
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

  api.addUmiExports(() => [
    {
      exportAll: true,
      source: '../plugin-layout/layoutExports',
    },
  ]);
  api.addRuntimePlugin(() => ['@@/plugin-layout/runtime.tsx']);
  api.addRuntimePluginKey(() => ['layoutActionRef']);
};
