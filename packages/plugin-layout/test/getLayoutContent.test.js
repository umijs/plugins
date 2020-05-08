import getLayoutContent from '../src/utils/getLayoutContent';

describe('getLayoutContent', () => {
  test('getLayoutContent', () => {
    const LayoutContent = getLayoutContent({}, 'test');

    expect(LayoutContent.includes(`require("test")`)).toBeTruthy();
    expect(LayoutContent.includes(`...{}`)).toBeTruthy();
  });
});
