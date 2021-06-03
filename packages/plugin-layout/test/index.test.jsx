import getLayoutRenderConfig from '../src/layout/getLayoutRenderConfig';
import BlankLayout from '../src/layout/blankLayout';
import { render } from '@testing-library/react';
import React from 'react';

describe('getLayoutRenderConfig', () => {
  it('getLayoutRenderConfig layout=false', () => {
    const layoutConfig = getLayoutRenderConfig(
      {
        layout: false,
      },
      false,
    );
    expect(layoutConfig.pure).toBeTruthy();
  });

  it('getLayoutRenderConfig hideMenu:true,hideFooter:true,hideNav:true', () => {
    const layoutConfig = getLayoutRenderConfig(
      {
        layout: { hideMenu: true, hideFooter: true, hideNav: true },
      },
      false,
    );
    expect(layoutConfig.menuRender).toBeFalsy();
    expect(layoutConfig.footerRender).toBeFalsy();
    expect(layoutConfig.headerRender).toBeFalsy();
  });

  it('getLayoutRenderConfig', () => {
    const layoutConfig = getLayoutRenderConfig(
      {
        layout: {},
      },
      false,
    );
    expect(layoutConfig.footerRender).toBeFalsy();
  });

  it('BlankLayout', () => {
    const { container } = render(<BlankLayout>Hello, World!</BlankLayout>);
    expect(container.firstChild).toMatchInlineSnapshot(`Hello, World!`);
  });
});
