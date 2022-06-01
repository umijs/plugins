import { rimraf } from '@umijs/utils';
import {
  build,
  Platform,
  createTargets,
  Configuration,
} from 'electron-builder';
import lodash from 'lodash';
import { join } from 'path';
import { TMP_DIR_PRODUCTION } from './constants';

const builderConfig = require('./config/electron-builder.config');
export const buildElectron = (customBuilderConfig?: Configuration) => {
  rimraf.sync(join(process.cwd(), 'dist'));

  const targets =
    process.platform === 'darwin'
      ? [Platform.MAC, Platform.WINDOWS]
      : [Platform.WINDOWS];

  return build({
    targets: createTargets(targets),
    config: lodash.merge(
      {
        directories: { output: '../dist' },
      } as Configuration,
      {
        dmg: {
          title: `\${productName}-\${version}`,
          artifactName: `\${productName}-\${version}.\${ext}`,
        },
        nsis: {
          artifactName: `\${productName}-setup-\${version}.\${ext}`,
        },
      } as Configuration,
      builderConfig as unknown as Configuration,
      customBuilderConfig || {},
    ),
    projectDir: join(process.cwd(), TMP_DIR_PRODUCTION),
  });
};
