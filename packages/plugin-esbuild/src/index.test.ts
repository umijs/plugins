import { join } from 'path';
import { Service } from 'umi';

const fixtures = join(__dirname, 'fixtures');

describe('normal build', () => {
  let err: any;
  beforeAll(async () => {
    const cwd = join(fixtures, 'normal');
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
  });
});

describe('ssr build', async () => {
  let err: any;
  beforeAll(async () => {
    const cwd = join(fixtures, 'ssr');
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
  });
});
