import { join } from 'path';

const { productName } = require(join(process.cwd(), 'package.json'));

module.exports = {
  electronDownload: {
    mirror: 'https://registry.npmmirror.com/binary.html?path=electron/',
  },
  productName,
  files: ['./**'],
  mac: {
    category: 'public.app-category.developer-tools',
    target: 'dmg',
  },
  dmg: {},
  win: {
    target: 'nsis',
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
  },
};
