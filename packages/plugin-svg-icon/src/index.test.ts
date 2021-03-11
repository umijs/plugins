import { join } from 'path';
import { Service } from 'umi';
import { render } from '@testing-library/react';

const fixtures = join(__dirname, './fixtures');

test('normal', async () => {
  const cwd = join(fixtures, 'normal');
  const service = new Service({
    cwd,
    plugins: [require.resolve('./')],
  });

  const reactNode = require(join(cwd, '.umi-test', 'umi.ts')).default;
  const { container } = render(reactNode);
  expect(container.textContent).toEqual('Hello World');
});
