import { join } from 'path';
import { Service } from 'umi';
import { render } from '@testing-library/react';

const fixtures = join(__dirname, 'fixtures');

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
