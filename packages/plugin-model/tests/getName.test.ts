import { getName } from '../src/utils';
import { join } from 'path';

const srcDir = ['models', 'model', 'pages', 'page'].map(dir =>
  join('ae/src', dir),
);

describe('getName test', () => {
  test('global model', () => {
    expect(getName(join('ae/src/models/global.ts'), srcDir)).toEqual('global');
  });
  test('page multiple model', () => {
    expect(
      getName(join('ae/src/pages/dashboard/Workplace/models/list.ts'), srcDir),
    ).toEqual('dashboard.Workplace.list');
  });
  test('page single model', () => {
    expect(
      getName(join('ae/src/pages/dashboard/Workplace/notice.model.ts'), srcDir),
    ).toEqual('dashboard.Workplace.notice');
  });
  test('page single model when singular is "page"', () => {
    expect(
      getName(join('ae/src/page/dashboard/Workplace/form.model.ts'), srcDir),
    ).toEqual('dashboard.Workplace.form');
  });
  test('other model', () => {
    expect(
      getName(join('ae/src/.umi/plugin-initial-state/models/initialState.ts')),
    ).toEqual('initialState');
  });
});
