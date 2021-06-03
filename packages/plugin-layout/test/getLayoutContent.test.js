import getLayoutContent, {
  genRenderRightContent,
} from '../src/utils/getLayoutContent';
import React from 'react';

describe('getLayoutContent', () => {
  it('getLayoutContent', () => {
    const LayoutContent = getLayoutContent({}, 'test');

    expect(
      LayoutContent.includes(`import LayoutComponent from 'test';`),
    ).toBeTruthy();
    expect(LayoutContent.includes(`...{}`)).toBeTruthy();
  });

  it('genRenderRightContent locale=false', () => {
    expect(
      genRenderRightContent({
        locale: false,
        initialState: true,
      }),
    ).toMatchSnapshot();
  });
  it('genRenderRightContent initialState=false', () => {
    expect(
      genRenderRightContent({
        locale: false,
        initialState: false,
      }),
    ).toMatchSnapshot();
  });

  it('genRenderRightContent', () => {
    expect(
      genRenderRightContent({
        locale: true,
        initialState: true,
      }),
    ).toMatchSnapshot();
  });
});
