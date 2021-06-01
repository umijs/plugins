import { join } from 'path';
import { generateTmp, render } from '@umijs/test-utils';
import { cleanup } from '@testing-library/react';

const fixtures = join(__dirname, 'fixtures');

afterEach(cleanup);

test('normal', async () => {
  const cwd = join(fixtures, 'normal');
  await generateTmp({ cwd });
  const { container } = render({ cwd });
  expect(container.innerHTML).toEqual(
    '<i class="svg-icon svg-icon-love">' +
      '<svg aria-hidden="true">' +
      '<use xlink:href="#icon-love"></use>' +
      '</svg>' +
      '</i>' +
      '<i class="svg-icon svg-icon-alipay">' +
      '<svg aria-hidden="true">' +
      '<use xlink:href="#icon-alipay"></use>' +
      '</svg>' +
      '</i>' +
      '<svg width="90" height="120">wechat.svg</svg>',
  );
});
