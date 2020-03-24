import React from 'react';
import { join } from 'path';
import { Service } from 'umi';
import {
  render,
  fireEvent,
  cleanup,
  waitForDomChange,
} from '@testing-library/react';

const fixtures = join(__dirname, 'fixtures');
let cwd = '';

async function setUp(name: string) {
  cwd = join(fixtures, name);
  const service = new Service({
    cwd,
    plugins: [require.resolve('./'), require.resolve('@umijs/plugin-model')],
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

test('setInitialState', async () => {
  await setUp('setInitialState');
  const App = require(join(
    fixtures,
    'setInitialState',
    'src',
    'pages',
    'index.js',
  )).default;

  const Provider = require(join(
    fixtures,
    'setInitialState',
    'src',
    '.umi-test',
    'plugin-model',
    'Provider.tsx',
  )).default;

  const renderRet = render(
    <Provider>
      <App />
    </Provider>,
  );
  await require(join(fixtures, 'setInitialState', 'test.js')).default({
    ...renderRet,
    fireEvent,
    waitForDomChange,
  });
});
