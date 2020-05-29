import { IApi, utils } from 'umi';
import { join } from 'path';
import { readFileSync } from 'fs';
import { checkIfHasDefaultExporting } from './utils';

const { Mustache, lodash, winPath } = utils;

const DIR_NAME = 'access-layout';
const MODEL_NAME = 'AccessLayout';
const RELATIVE_MODEL = join(DIR_NAME, MODEL_NAME);

function toHump(name: string) {
  return name.replace(/\-(\w)/g, function(all, letter) {
    return letter.toUpperCase();
  });
}

function formatter(data: any, iconNames: string[] = []): any[] {
  if (!Array.isArray(data)) {
    return iconNames.map((icon: any) => {
      const v4IconName = toHump(icon.replace(icon[0], icon[0].toUpperCase()));
      return {
        v4IconName: v4IconName === icon ? v4IconName : `${v4IconName}Outlined`,
        name: icon,
      };
    });
  }
  let icons: any[] = [];
  (data || []).forEach((item = { path: '/' }) => {
    if (item.icon) {
      const { icon } = item;
      const v4IconName = toHump(icon.replace(icon[0], icon[0].toUpperCase()));
      icons.push({
        v4IconName: v4IconName === icon ? v4IconName : `${v4IconName}Outlined`,
        name: icon,
      });
    }
    const items = item.routes || item.children;
    if (items) {
      icons = icons.concat(formatter(items, []));
    }
  });

  return icons;
}

export default (api: IApi) => {
  if (!api.userConfig.accessLayout) return;
  const hasLocale = !!api.userConfig.locale;
  const accessFilePath = api.utils.winPath(
    join(api.paths.absSrcPath!, 'access'),
  );
  const hasAccess = checkIfHasDefaultExporting(accessFilePath);
  api.describe({
    key: 'accessLayout',
    config: {
      default: {},
      schema(joi) {
        return joi.object({
          iconNames: joi.array(),
          useModel: joi.boolean(),
        });
      },
      onChange: api.ConfigChangeType.regenerateTmpFiles,
    },
  });

  // 没有 routes 配置，表示使用约定式路由
  const isConventionRouting = !api.userConfig.routes;
  // 约定式的这个需要明确写明，配置式的可选
  const { iconNames, useModel } = api.userConfig.accessLayout;
  if (isConventionRouting && !iconNames) {
    api.logger.error('未在配置中写明使用到的icon，将会导致菜单栏icon无法显示!');
  }
  const icons = formatter(api.userConfig.routes, iconNames);
  api.onGenerateFiles(() => {
    const accessLayoutTpl = readFileSync(
      join(__dirname, 'AccessLayout.tpl'),
      'utf-8',
    );
    const importIcons = icons.map(
      ({ v4IconName }) =>
        `import ${v4IconName} from '@ant-design/icons/${v4IconName}'`,
    );
    const useIcons = icons.map(
      ({ name, v4IconName }) => `${name}:<${v4IconName} />`,
    );
    const utilsPath = winPath(
      join(__dirname, '..', 'lib', 'utils', 'runtimeUtil'),
    );
    api.writeTmpFile({
      path: join(DIR_NAME, 'AccessLayout.tsx'),
      content: Mustache.render(accessLayoutTpl, {
        importIcons: importIcons.join(';\n'),
        utilsPath,
        useModel,
        hasLocale,
        noLocale: !hasLocale,
        hasAccess,
        noAccess: !hasAccess,
        noModel: !useModel,
        useIcons: useIcons.join(',\n'),
      }),
    });
    const componentsTpl = readFileSync(
      join(__dirname, 'components.tpl'),
      'utf-8',
    );
    api.writeTmpFile({
      path: join(DIR_NAME, 'components.tsx'),
      content: componentsTpl,
    });
    const layoutContentTpl = readFileSync(
      join(__dirname, 'LayoutContent.tpl'),
      'utf-8',
    );
    api.writeTmpFile({
      path: join(DIR_NAME, 'LayoutContent.tsx'),
      content: layoutContentTpl,
    });
    if (useModel) {
      const layoutModelTpl = readFileSync(
        join(__dirname, 'LayoutModel.tpl'),
        'utf-8',
      );
      api.writeTmpFile({
        path: join(DIR_NAME, 'LayoutModel.tsx'),
        content: layoutModelTpl,
      });
    }
  });

  api.modifyDefaultConfig(config => {
    // @ts-ignore
    config.title = false;
    return config;
  });

  if (useModel) {
    api.register({
      key: 'addExtraModels',
      fn: () => [
        {
          absPath: winPath(
            join(api.paths.absTmpPath!, DIR_NAME, 'LayoutModel.ts'),
          ),
          namespace: '@@accessLayout',
        },
      ],
    });
  }

  // 使用配置式
  if (!isConventionRouting) {
    // 注册runtime配置
    api.addRuntimePluginKey(() => 'accessLayout');
    api.modifyRoutes(routes => [
      {
        path: '/',
        component: winPath(
          join(api.paths.absTmpPath || '', DIR_NAME, 'LayoutContent.tsx'),
        ),
        routes,
      },
    ]);
  }
  api.addUmiExports(() => [
    {
      exportAll: true,
      source: `../${RELATIVE_MODEL}`,
    },
  ]);
};
