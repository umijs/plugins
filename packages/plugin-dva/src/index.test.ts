import { join } from 'path';
import { utils } from 'umi';
import { render, fireEvent, getByText, cleanup } from '@testing-library/react';
import { generateTmp } from '../../../test/testUtils';

const fixtures = join(__dirname, 'fixtures');

afterEach(cleanup);

test('normal', async () => {
  const cwd = join(fixtures, 'normal');
  await generateTmp({
    cwd,
    plugins: [require.resolve('./')],
  });

  const { container } = render(
    require(join(cwd, '.umi-test', 'umi.ts')).default,
  );
  expect(container.innerHTML).toEqual(
    '<div><h1 class="title">Page index foo 0</h1></div>',
  );
});

test('page models', async () => {
  const cwd = join(fixtures, 'page-models');
  await generateTmp({
    cwd,
    plugins: [require.resolve('./')],
  });

  const { container } = render(
    require(join(cwd, '.umi-test', 'umi.ts')).default,
  );
  expect(container.innerHTML).toEqual(
    '<div><h1 class="title">Page index foo 0 bar 1</h1></div>',
  );
});

test('with-immer', async () => {
  const cwd = join(fixtures, 'with-immer');
  await generateTmp({
    cwd,
    plugins: [require.resolve('./')],
  });

  const { container } = render(
    require(join(cwd, '.umi-test', 'umi.ts')).default,
  );
  expect(container.innerHTML).toEqual(
    '<div><h1 class="title">Page index foo 0</h1><button>add</button></div>',
  );
  fireEvent.click(getByText(container, 'add'));
  await utils.delay(100);
  expect(container.innerHTML).toEqual(
    '<div><h1 class="title">Page index foo 1</h1><button>add</button></div>',
  );
});
