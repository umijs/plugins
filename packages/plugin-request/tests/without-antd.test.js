import { readFileSync } from 'fs';
import { join } from 'path';
import { filterAntd } from '../src/index';

test('filterAntd normal', () => {
  const requestTmp = readFileSync(
    join(__dirname, '../src/request.ts'),
    'utf-8',
  );
  expect(requestTmp).toContain('antd');

  const filterContent = filterAntd(requestTmp);
  expect(filterContent).not.toContain('antd');
  expect(filterContent).not.toContain('message.error');
  expect(filterContent).not.toContain('message.warn');
  expect(filterContent).not.toContain('notification.open');
});
