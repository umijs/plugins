import { join } from 'path';
import { fork } from 'child_process';
import { nodePolyfill } from '../src/utils';
import _ from 'lodash';
import { existsSync, readdirSync } from 'fs';

const fixtures = join(__dirname, 'fixtures');
let dirs = readdirSync(fixtures).filter(dir => dir.charAt(0) !== '.');
const testOnly = dirs.some(dir => /-only/.test(dir));
if (testOnly) {
  dirs = dirs.filter(dir => /-only/.test(dir));
}
dirs = dirs.filter(dir => !/^x-/.test(dir));


async function umiBuild(cwd) {
  return new Promise((resolve, reject) => {
    const umiPath = join(__dirname, '..', 'node_modules', '.bin', 'umi');
    const env = {
      COMPRESS: 'none',
      PROGRESS: 'none',
      COVERAGE: 1,
    };
    const child = fork(umiPath, ['build'], {
      cwd,
      env,
    });
    child.on('exit', code => {
      if (code === 1) {
        reject(new Error('Build failed'));
      } else {
        resolve();
      }
    });
  });
}

describe('test unit', () => {
  beforeAll(() => {
    global.UMI_LODASH = _;
  });

  beforeEach(() => {
    global.window = {};
  });

  it('nodePolyfill object not BOM object', () => {
    const mock = nodePolyfill('http://localhost/about', {
      USER_DEFINED: 'hello',
    });
    // pathname must use return
    expect(mock.location.pathname).toEqual('/about');
    expect(window.USER_DEFINED).toEqual('hello');
    expect(USER_DEFINED).toEqual('hello');
  });

  it('nodePolyfill object not BOM object', () => {
    const mock = nodePolyfill('http://localhost/news', {
      context: {
        username: 'ycjcl868'
      },
    });
    expect(mock.location.pathname).toEqual('/news');
    expect(window.context.username).toEqual('ycjcl868');
    expect(context.username).toEqual('ycjcl868');
  });


  it('nodePolyfill object function call', () => {
    const mock = nodePolyfill('http://localhost/news', () => ({
      context: {
        username: 'functionCall'
      }
    }));
    expect(mock.location.pathname).toEqual('/news');
    expect(window.context.username).toEqual('functionCall');
    expect(context.username).toEqual('functionCall');
  });

})

describe('build fixtures', () => {
  require('./test-build-result')({
    root: join(__dirname, './fixtures'),
    build: async ({ cwd, dir }) => {
      await umiBuild(cwd);
    },
  });
})
