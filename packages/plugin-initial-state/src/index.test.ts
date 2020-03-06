import { join } from 'path';
import { Service } from 'umi';
import { cleanup } from '@testing-library/react';

const fixtures = join(__dirname, 'fixtures');
let cwd = '';

async function setUp(name: string) {
  cwd = join(fixtures, name);
  const service = new Service({
    cwd,
    plugins: [require.resolve('./')],
  });
  await service.run({
    name: 'g',
    args: {
      _: ['g', 'tmp'],
    },
  });
}

afterEach(() => {
  cleanup();
});

test('default', async () => {
  await setUp('default');
  const exportCode = require(join(
    cwd,
    'src',
    '.umi-test',
    'core',
    'umiExports.ts',
  )).__PLUGIN_INITIAL_STATE;
  expect(exportCode).toEqual(1);
});

test('noExports', async () => {
  await setUp('noExports');
  const stateHook = require(join(
    cwd,
    'src',
    '.umi-test',
    'plugin-initial-state',
    'models',
    'initialState.ts',
  )).default;
  // initialState 不存在
  const state = stateHook();
  expect(state.loading).toBeFalsy();
  expect(state.initialState).toBeUndefined();
});

test('noEntry', async () => {
  await setUp('noEntry');
  const stateHook = require(join(
    cwd,
    'src',
    '.umi-test',
    'plugin-initial-state',
    'models',
    'initialState.ts',
  )).default;
  // initialState 不存在
  const state = stateHook();
  expect(state.loading).toBeFalsy();
  expect(state.initialState).toBeUndefined();
});
