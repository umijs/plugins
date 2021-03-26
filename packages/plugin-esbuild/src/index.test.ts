import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { Service } from 'umi';

import { getEsbuildTargetFromEngine } from './index';

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
      'new TypeError("Invalid attempt to spread non-iterable',
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

describe('getEsbuildTargetFromEngine', () => {
  it('normal', () => {
    expect(getEsbuildTargetFromEngine({})).toEqual(['esnext']);
    expect(
      getEsbuildTargetFromEngine({
        ie: 11,
      }),
    ).toEqual(['es5']);
    expect(
      getEsbuildTargetFromEngine({
        notexisted: 11,
      }),
    ).toEqual(['esnext']);
    expect(
      getEsbuildTargetFromEngine({
        node: true,
        chrome: 49,
        firefox: 64,
        safari: 10,
        edge: 13,
        ios: 10,
      }),
    ).toEqual(['chrome49', 'firefox64', 'safari10', 'edge13', 'ios10']);

    expect(
      getEsbuildTargetFromEngine({
        node: true,
        chrome: 49,
        firefox: 64,
        safari: 10,
        edge: 13,
        ios: 10,
        notExisted: 100,
      }),
    ).toEqual(['chrome49', 'firefox64', 'safari10', 'edge13', 'ios10']);
  });
});
