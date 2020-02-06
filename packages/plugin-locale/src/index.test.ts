import { join } from 'path';
import { Service } from 'umi';
import { render, fireEvent } from '@testing-library/react';

const fixtures = join(__dirname, '..', 'fixtures');

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
  expect(container.querySelector('h1')?.textContent).toEqual(
    'Current language:en-US',
  );
  expect(container.querySelector('button')?.textContent).toEqual(
    'Hello Traveler',
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
