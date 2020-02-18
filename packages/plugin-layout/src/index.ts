import { IApi, utils } from 'umi';
import { join } from 'path';
import getLayoutContent from './utils/getLayoutContent';
import { LayoutConfig } from './types/interface.d';

const DIR_NAME = 'plugin-layout';

export default (api: IApi) => {
  api.describe({
    key: 'layout',
    config: {
      default: {},
      schema(joi) {
        return joi.object();
      },
      onChange: api.ConfigChangeType.regenerateTmpFiles,
    },
  });

  let layoutOpts: LayoutConfig = {};

  api.addRuntimePluginKey(() => 'layout');

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
  });

  api.modifyRoutes(routes => [
    {
      path: '/',
      component: join(api.paths.absTmpPath || '', DIR_NAME, 'Layout.tsx'),
      routes,
    },
  ]);
};
