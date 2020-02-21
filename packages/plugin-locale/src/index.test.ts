import { join } from 'path';
import { Service } from 'umi';
import { render, fireEvent, cleanup } from '@testing-library/react';
import IntlPolyfill from 'intl';
import 'intl/locale-data/jsonp/zh-Hans-CN';
import 'intl/locale-data/jsonp/en-US';
import 'intl/locale-data/jsonp/zh-Hant-TW';
import 'intl/locale-data/jsonp/sk';

const setupTests = () => {
  // https://formatjs.io/guides/runtime-environments/#server
  if (global.Intl) {
    Intl.NumberFormat = IntlPolyfill.NumberFormat;
    Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
  } else {
    global.Intl = IntlPolyfill;
  }
};

const fixtures = join(__dirname, '..', 'fixtures');

beforeEach(() => {
  setupTests();
});

afterEach(() => {
  cleanup();
  window.localStorage.setItem('umi_locale', '');
});

test('normal', async () => {
  const cwd = join(fixtures, 'base');
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

  const reactNode = require(join(cwd, 'src', '.umi-test', 'umi.ts')).default;
  const { container, getByText, rerender } = render(reactNode);

  fireEvent.click(getByText('en-US'));
  expect(container.querySelector('h2')?.textContent).toEqual('Hello Traveler');
  expect(container.querySelector('h1')?.textContent).toEqual(
    'Current language:en-US',
  );
  expect(container.querySelector('button')?.textContent).toEqual(
    'Hello Traveler',
  );

  fireEvent.click(getByText('zh-TW'));
  expect(container.querySelector('h2')?.textContent).toEqual('妳好 Traveler');
  expect(container.querySelector('h1')?.textContent).toEqual(
    'Current language:zh-TW',
  );
  expect(container.querySelector('button')?.textContent).toEqual(
    '妳好 Traveler',
  );

  fireEvent.click(getByText('sk'));
  expect(container.querySelector('h2')?.textContent).toEqual('sk Traveler');
  expect(container.querySelector('h1')?.textContent).toEqual(
    'Current language:sk',
  );
  expect(container.querySelector('button')?.textContent).toEqual('sk Traveler');
});

test('singular', async () => {
  const cwd = join(fixtures, 'singular');
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

  const reactNode = require(join(cwd, 'src', '.umi-test', 'umi.ts')).default;
  const { container, getByText, rerender } = render(reactNode);

  // test default: zh-CN
  expect(container.querySelector('h1')?.textContent).toEqual(
    'Current language:zh-CN',
  );

  fireEvent.click(getByText('en-US'));
  expect(container.querySelector('h1')?.textContent).toEqual(
    'Current language:en-US',
  );
  expect(container.querySelector('button')?.textContent).toEqual(
    'Hello Traveler',
  );

  fireEvent.click(getByText('zh-CN'));
  expect(container.querySelector('h1')?.textContent).toEqual(
    'Current language:zh-CN',
  );
  expect(container.querySelector('button')?.textContent).toEqual(
    '你好 Traveler',
  );

  fireEvent.click(getByText('zh-TW'));
  expect(container.querySelector('h1')?.textContent).toEqual(
    'Current language:zh-TW',
  );
  expect(container.querySelector('button')?.textContent).toEqual(
    '妳好 Traveler',
  );

  fireEvent.click(getByText('sk'));
  expect(container.querySelector('h1')?.textContent).toEqual(
    'Current language:sk',
  );
  expect(container.querySelector('button')?.textContent).toEqual('sk Traveler');
});
