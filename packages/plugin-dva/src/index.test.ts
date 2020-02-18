import { join } from 'path';
import { Service, utils } from 'umi';
import { render, fireEvent, getByText, cleanup } from '@testing-library/react';

const fixtures = join(__dirname, 'fixtures');

afterEach(cleanup);

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

  const { container } = render(
    require(join(cwd, '.umi-test', 'umi.ts')).default,
  );
  expect(container.innerHTML).toEqual(
    '<div><h1 class="title">Page index foo 0</h1></div>',
  );
});

test('with-immer', async () => {
  const cwd = join(fixtures, 'with-immer');
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
