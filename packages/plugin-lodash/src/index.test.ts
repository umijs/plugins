import { readFileSync } from 'fs';
import { join } from 'path';
import { Service } from 'umi';

const fixtures = join(__dirname, '..', 'fixtures');

describe('normal', () => {
  const cwd = join(fixtures, 'normal');
  beforeAll(async () => {
    const service = new Service({
      cwd,
      plugins: [require.resolve('./')],
    });
    await service.run({
      name: 'build',
    });
  });

  it('normal', () => {
    const umiJS = readFileSync(join(cwd, 'dist/umi.js'), 'utf-8');
    expect(umiJS).toMatch(/lodash_isEmpty.+?hello_lodash/i);
  });
});
