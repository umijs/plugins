import { join } from 'path';
import { existsSync } from 'fs';
import { Service } from 'umi';

const fixtures = join(__dirname, 'fixtures');

describe('normal build', () => {
  let err: any;
  const cwd = join(fixtures, 'normal');
  beforeAll(async () => {
    const service = new Service({
      cwd,
      env: 'production',
      plugins: [require.resolve('./index.ts')],
    });
    let err;
    try {
      await service.run({
        name: 'build',
      });
    } catch (e) {
      console.error('normal build error', e);
      err = true;
    }
  });

  it('normal', () => {
    expect(err).toBeFalsy();
    expect(existsSync(join(cwd, 'dist', 'umi.js'))).toBeTruthy();
  });
});

describe('ssr build', () => {
  let err: any;
  const cwd = join(fixtures, 'ssr');
  beforeAll(async () => {
    const service = new Service({
      cwd,
      env: 'production',
      plugins: [require.resolve('./index.ts')],
    });
    try {
      await service.run({
        name: 'build',
      });
      err = false;
    } catch (e) {
      console.error('ssr build error', e);
      err = true;
    }
  });

  it('ssr build', () => {
    expect(err).toBeFalsy();
    expect(existsSync(join(cwd, 'dist', 'umi.js'))).toBeTruthy();
    expect(existsSync(join(cwd, 'dist', 'umi.server.js'))).toBeTruthy();
  });
});
