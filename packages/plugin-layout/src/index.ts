import { IApi } from 'umi-types';
import { join } from 'path';
import getLayoutContent from './utils/getLayoutContent';
import { LayoutConfig } from './types/interface.d';

const DEFAULT_ANTFIN_LOGO =
  'https://gw.alipayobjects.com/zos/rmsportal/VjSUcTzdEiSwfnvdapaa.png';
const DIR_NAME = 'plugin-layout';

export default (api: IApi, opts: LayoutConfig = {}) => {
  let layoutOpts: LayoutConfig = { ...opts };
  api.onOptionChange(newOption => {
    opts = newOption; // eslint-disable-line no-param-reassign
    api.rebuildTmpFiles();
  });

  api.addRuntimePluginKey('layout');

  api.onGenerateFiles(() => {
    // apply default options
    layoutOpts = {
      name: require(join(api.paths.cwd, 'package.json')).name,
      logo: DEFAULT_ANTFIN_LOGO,
      theme: 'PRO',
      locale: false,
      showBreadcrumb: true,
      ...(api.config as any).layout,
      ...opts,
    };

    // allow custom theme
    let layoutComponent = {
      PRO: api.winPath(join(__dirname, './layout/index.js')),
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

    api.writeTmpFile(
      join(DIR_NAME, 'Layout.tsx'),
      getLayoutContent(layoutOpts, currentLayoutComponentPath),
    );
  });

  api.modifyRoutes(routes => [
    {
      path: '/',
      component: join(api.paths.absTmpDirPath, DIR_NAME, 'Layout.tsx'),
      routes,
    },
  ]);
};
