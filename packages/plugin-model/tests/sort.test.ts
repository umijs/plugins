import '@testing-library/jest-dom/extend-expect';
import { sort } from '../src/utils';

describe('sort test', () => {
  test('normal test case', () => {
    const ret = sort([
      { namespace: 'a', use: ['b', 'c'] },
      { namespace: 'b', use: ['c', 'd'] },
      { namespace: 'c', use: ['e'] },
      { namespace: 'd', use: ['e'] },
      { namespace: 'e', use: [] },
    ]);

    expect(ret.indexOf('a') > ret.indexOf('b'));
    expect(ret.indexOf('b') > ret.indexOf('c'));
    expect(ret.indexOf('b') > ret.indexOf('d'));
    expect(ret.indexOf('c') > ret.indexOf('e'));
  });
  test('circular dependencies', () => {
    try {
      sort([
        { namespace: 'a', use: ['b', 'c'] },
        { namespace: 'b', use: ['c', 'd'] },
        { namespace: 'c', use: ['e'] },
        { namespace: 'd', use: ['e'] },
        { namespace: 'e', use: ['d'] },
      ]);
    } catch (e) {
      expect(e).toEqual(new Error("Circular dependencies: e can't use d"));
    }
  });
  test('multiple circular dependencies', () => {
    try {
      sort([
        { namespace: 'a', use: ['b', 'c'] },
        { namespace: 'b', use: ['c', 'd'] },
        { namespace: 'c', use: ['e'] },
        { namespace: 'd', use: ['e'] },
        { namespace: 'e', use: ['d', 'e'] },
      ]);
    } catch (e) {
      expect(e).toEqual(new Error("Circular dependencies: e can't use d, e"));
    }
  });
});
