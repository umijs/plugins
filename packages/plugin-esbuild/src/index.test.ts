import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { Service } from 'umi';

const fixtures = join(__dirname, 'fixtures');

jest.setTimeout(300000);

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
    expect(readFileSync(join(cwd, 'dist', 'umi.js'), 'utf8')).toContain(
      'new TypeError(`Invalid attempt to spread non-iterable',
    );
  });
});

describe('es5 build', () => {
  let err: any;
  const cwd = join(fixtures, 'es5');
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
      console.error('es5 build error', e);
      err = true;
    }
  });

  it('es5', () => {
    expect(err).toBeFalsy();
    expect(existsSync(join(cwd, 'dist', 'umi.js'))).toBeTruthy();
    expect(readFileSync(join(cwd, 'dist', 'umi.js'), 'utf8')).toContain(
      'throw new TypeError("Invalid attempt to spread non-iterable instance',
    );
  });
});

describe.skip('no-es5 build', () => {
  let err: any;
  const cwd = join(fixtures, 'no-es5');
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
      console.error('no-es5 build error', e);
      err = true;
    }
  });

  it('no-es5', () => {
    expect(err).toBeFalsy();
    expect(existsSync(join(cwd, 'dist', 'umi.js'))).toBeTruthy();
    expect(readFileSync(join(cwd, 'dist', 'umi.js'), 'utf8')).toContain(
      'new TypeError(`Invalid attempt to spread non-iterable',
    );
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
