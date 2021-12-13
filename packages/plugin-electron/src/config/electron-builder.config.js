import { join } from 'path';

const { productName } = require(join(process.cwd(), 'package.json'));

module.exports = {
  electronDownload: {
    mirror: 'https://npm.taobao.org/mirrors/electron/',
  },
  productName,
  files: ['.electron/**'],
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
