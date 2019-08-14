import { existsSync } from 'fs';
import { join } from 'path';

export default async function () {
  const umiServePath = join(__dirname, 'dist', 'umi.server.js');
  console.log('templates', templates);
  expect(existsSync(umiServePath)).toEqual(true);

};
