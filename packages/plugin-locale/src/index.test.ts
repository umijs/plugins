import { join } from 'path';
import { Service } from 'umi';
import { render, fireEvent, cleanup } from '@testing-library/react';
import IntlPolyfill from 'intl';
import 'intl/locale-data/jsonp/zh-Hans-CN';
import 'intl/locale-data/jsonp/en-US';
import 'intl/locale-data/jsonp/zh-Hant-TW';
import 'intl/locale-data/jsonp/sk';
import { packageNormalize } from '.';

const setupTests = () => {
  // https://formatjs.io/guides/runtime-environments/#server
  if (global.Intl) {
    Intl.NumberFormat = IntlPolyfill.NumberFormat;
    Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
    // https://github.com/andyearnshaw/Intl.js/issues/256#issuecomment-267705446
    // https://github.com/andyearnshaw/Intl.js#regexp-cache--restore
    IntlPolyfill.__disableRegExpRestore();
  } else {
    global.Intl = IntlPolyfill;
  }
};

const fixtures = join(__dirname, '..', 'fixtures');

beforeAll(() => {
  setupTests();
});

afterEach(() => {
  cleanup();
  window.localStorage.setItem('umi_locale', '');
});

test('normal', async () => {
  const cwd = join(fixtures, 'normal');
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
  const { container, getByText } = render(reactNode);

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
  const { container, getByText, getByTestId } = render(reactNode);

  // test default: zh-CN
  expect(container.querySelector('h1')?.textContent).toEqual(
    'Current language:zh-CN',
  );
  expect(container.querySelector('#title')?.textContent).toEqual('关于标题');
  expect(
    container.querySelector('.ant-picker-input > input')?.placeholder,
  ).toEqual('请选择日期');
  expect(container.querySelector('#moment')?.textContent).toEqual(
    '2020年3月21日',
  );

  fireEvent.click(getByText('en-US'));
  expect(container.querySelector('h1')?.textContent).toEqual(
    'Current language:en-US',
  );
  expect(
    container.querySelector('.ant-picker-input > input')?.placeholder,
  ).toEqual('Select date');
  expect(container.querySelector('#moment')?.textContent).toEqual(
    'March 21, 2020',
  );
  expect(getByTestId('display')?.textContent).toEqual('Hello Traveler');

  fireEvent.click(getByText('zh-CN'));
  expect(container.querySelector('h1')?.textContent).toEqual(
    'Current language:zh-CN',
  );
  expect(
    container.querySelector('.ant-picker-input > input')?.placeholder,
  ).toEqual('请选择日期');
  expect(container.querySelector('#moment')?.textContent).toEqual(
    '2020年3月21日',
  );
  expect(getByTestId('display')?.textContent).toEqual('你好 Traveler');

  fireEvent.click(getByText('zh-TW'));
  expect(container.querySelector('h1')?.textContent).toEqual(
    'Current language:zh-TW',
  );
  expect(
    container.querySelector('.ant-picker-input > input')?.placeholder,
  ).toEqual('請選擇日期');
  expect(container.querySelector('#moment')?.textContent).toEqual(
    '2020年3月21日',
  );
  expect(getByTestId('display')?.textContent).toEqual('妳好 Traveler');

  fireEvent.click(getByText('sk'));
  expect(container.querySelector('h1')?.textContent).toEqual(
    'Current language:sk',
  );
  expect(
    container.querySelector('.ant-picker-input > input')?.placeholder,
  ).toEqual('Vybrať dátum');
  expect(container.querySelector('#moment')?.textContent).toEqual(
    '21. marec 2020',
  );
  expect(getByTestId('display')?.textContent).toEqual('sk Traveler');
});

test('runtime', async () => {
  const cwd = join(fixtures, 'runtime');
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
  const { container, rerender, getByTestId, getByText } = render(reactNode);
  expect(container.querySelector('h1')?.textContent).toEqual(
    'Current language:sk',
  );
  expect(
    container.querySelector('.ant-picker-input > input')?.placeholder,
  ).toEqual('Vybrať dátum');
  expect(container.querySelector('#moment')?.textContent).toEqual(
    '21. marec 2020',
  );
  expect(getByTestId('display')?.textContent).toEqual('sk Traveler');
});

test('base-separator', async () => {
  const cwd = join(fixtures, 'base-separator');
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
  const { container, getByText, getByTestId } = render(reactNode);

  // test default: zh_CN
  expect(container.querySelector('h1')?.textContent).toEqual(
    'Current language:zh_CN',
  );
  expect(
    container.querySelector('.ant-picker-input > input')?.placeholder,
  ).toEqual('请选择日期');
  expect(container.querySelector('#moment')?.textContent).toEqual(
    '2020年3月21日',
  );

  fireEvent.click(getByText('en_US'));
  expect(container.querySelector('h1')?.textContent).toEqual(
    'Current language:en_US',
  );
  expect(
    container.querySelector('.ant-picker-input > input')?.placeholder,
  ).toEqual('Select date');
  expect(container.querySelector('#moment')?.textContent).toEqual(
    'March 21, 2020',
  );
  expect(getByTestId('display')?.textContent).toEqual('Hello Traveler');

  fireEvent.click(getByText('zh_CN'));
  expect(container.querySelector('h1')?.textContent).toEqual(
    'Current language:zh_CN',
  );
  expect(
    container.querySelector('.ant-picker-input > input')?.placeholder,
  ).toEqual('请选择日期');
  expect(container.querySelector('#moment')?.textContent).toEqual(
    '2020年3月21日',
  );
  expect(getByTestId('display')?.textContent).toEqual('你好 Traveler');

  fireEvent.click(getByText('zh_TW'));
  expect(container.querySelector('h1')?.textContent).toEqual(
    'Current language:zh_TW',
  );
  expect(
    container.querySelector('.ant-picker-input > input')?.placeholder,
  ).toEqual('請選擇日期');
  expect(container.querySelector('#moment')?.textContent).toEqual(
    '2020年3月21日',
  );
  expect(getByTestId('display')?.textContent).toEqual('妳好 Traveler');

  fireEvent.click(getByText('sk'));
  expect(container.querySelector('h1')?.textContent).toEqual(
    'Current language:sk',
  );
  expect(
    container.querySelector('.ant-picker-input > input')?.placeholder,
  ).toEqual('Vybrať dátum');
  expect(container.querySelector('#moment')?.textContent).toEqual(
    '21. marec 2020',
  );
  expect(getByTestId('display')?.textContent).toEqual('sk Traveler');
});

test('package normalize', () => {
  expect(packageNormalize('@ant-design/pro-table')).toEqual(
    '_ant_design_pro_table',
  );
  expect(packageNormalize('@alipay/tech-ui/es/locale/zh-CN')).toEqual(
    '_alipay_tech_ui_es_locale_zh_CN',
  );
  expect(packageNormalize('@alipay/tech-ui/es/locale/zh-CN.js')).toEqual(
    '_alipay_tech_ui_es_locale_zh_CN_js',
  );
});
