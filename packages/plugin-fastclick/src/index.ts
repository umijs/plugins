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
  api.describe({
    key: 'fastClick',
    config: {
      schema(joi) {
        return joi.alternatives(joi.object(), joi.boolean());
      },
    },
  });
  if (!api.userConfig.fastClick) {
    return;
  }

  api.addEntryImports(() => {
    const { libraryPath = '' } = (api.config.fastClick ||
      {}) as FastClickOptions;
    return {
      source: libraryPath
        ? require.resolve(libraryPath)
        : dirname(require.resolve('fastclick/package')),
      specifier: 'FastClick',
    };
  });

  api.addEntryCodeAhead(() => {
    const { libraryPath, ...restOpts } = (api.config.fastClick ||
      {}) as FastClickOptions;
    const tpl = readFileSync(join(__dirname, 'fastClick.tpl'), 'utf-8');
    return Mustache.render(tpl, {
      Options: JSON.stringify(restOpts || {}),
    });
  });
};
