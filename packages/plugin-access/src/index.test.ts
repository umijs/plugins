import { generateTmp, render } from '@umijs/test-utils';
import { join } from 'path';
import { cleanup } from '@testing-library/react';

const fixtures = join(__dirname, 'fixtures');

afterEach(cleanup);

test('normal', async () => {
  const cwd = join(fixtures, 'normal');
  await generateTmp({ cwd });
  const { container } = render({ cwd });
  expect(container.innerHTML).toEqual('<div><h1>unaccessible: true</h1></div>');
});
