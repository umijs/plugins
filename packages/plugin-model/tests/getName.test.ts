import { getName } from '../src/utils';

describe('getName test', () => {
  test('global model', () => {
    expect(getName('ae/src/models/global.ts')).toEqual('global');
  });
  test('page multiple model', () => {
    expect(getName('ae/src/pages/dashboard/Workplace/models/list.ts')).toEqual(
      'dashboard.Workplace.list',
    );
  });
  test('page single model', () => {
    expect(getName('ae/src/pages/dashboard/Workplace/notice.model.ts')).toEqual(
      'dashboard.Workplace.notice',
    );
  });
  test('page single model when singular is "page"', () => {
    expect(getName('ae/src/page/dashboard/Workplace/form.model.ts')).toEqual(
      'dashboard.Workplace.form',
    );
  });
  test('other model', () => {
    expect(
      getName('ae/src/.umi/plugin-initial-state/models/initialState.ts'),
    ).toEqual('initialState');
  });
});
