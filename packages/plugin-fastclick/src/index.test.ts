import { join } from 'path';
import { readFileSync } from 'fs';
import { Service, utils } from 'umi';
import { render, fireEvent, cleanup } from '@testing-library/react';

const fixtures = join(__dirname, 'fixtures');
const { winPath } = utils;

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

  const reactNode = require(join(cwd, 'src', '.umi-test', 'umi.ts')).default;
  const { container } = render(reactNode);

  expect(container.querySelector('h1')?.textContent).toEqual('hello fastClick');
});

test('customFastClick', async () => {
  const cwd = join(fixtures, 'customFastClick');
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

  const umiPath = join(cwd, 'src', '.umi-test', 'umi.ts');
  const reactNode = require(umiPath).default;
  expect(readFileSync(umiPath, 'utf-8')).toContain(
    `import FastClick from '${winPath(
      require.resolve(join(__dirname, './fixtures/customFastClick/fastClick')),
    )}'`,
  );
  const { container } = render(reactNode);

  expect(container.querySelector('h1')?.textContent).toEqual('hello fastClick');
});
