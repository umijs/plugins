import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import { IApi } from 'umi';

export interface FastClickOptions {
  /** Specify then the FastClick library is from */
  libraryPath?: string;
  /** fastClick options */
  touchBoundary?: number;
  tapDelay?: number;
}

export default (api: IApi) => {
  const {
    utils: { Mustache },
  } = api;

  if (!api.userConfig.fastclick) {
    return;
  }

  // [Bread Change] 原配置为 fastClick
  api.describe({
    key: 'fastclick',
    config: {
      schema(joi) {
        return joi.alternatives(joi.object(), joi.boolean());
      },
    },
  });

  api.addEntryImports(() => {
    const { libraryPath = '' } = (api.config.fastclick ||
      {}) as FastClickOptions;
    return {
      source: libraryPath
        ? require.resolve(libraryPath)
        : dirname(require.resolve('fastclick/package')),
      specifier: 'FastClick',
    };
  });

  api.addEntryCodeAhead(() => {
    const { libraryPath, ...restOpts } = (api.config.fastclick ||
      {}) as FastClickOptions;
    const tpl = readFileSync(join(__dirname, 'fastClick.tpl'), 'utf-8');
    return Mustache.render(tpl, {
      Options: JSON.stringify(restOpts || {}),
    });
  });
};
