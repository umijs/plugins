import { generateTmp } from '../../../test/testUtils';
import { join } from 'path';
import { cleanup, render } from '@testing-library/react';

const fixtures = join(__dirname, 'fixtures');

afterEach(cleanup);

test('normal', async () => {
  const cwd = join(fixtures, 'normal');
  await generateTmp({
    cwd,
    plugins: [
      require.resolve('./'),
      require.resolve('@umijs/plugin-initial-state'),
      require.resolve('@umijs/plugin-model'),
    ],
  });

  const { container } = render(
    require(join(cwd, '.umi-test', 'umi.ts')).default,
  );
  expect(container.innerHTML).toEqual('<div><h1>unaccessible: true</h1></div>');
});
