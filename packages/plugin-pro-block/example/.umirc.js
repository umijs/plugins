import { join } from 'path';

export default {
  plugins: [
    join(__dirname, '..', require('../package').main || 'index.js'),
    ['umi-plugin-react', {
      dva: true,
      antd: true,
    }],
  ],
}
