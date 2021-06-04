import getLayoutRenderConfig from '../src/layout/getLayoutRenderConfig';
import copySrcFiles from '../src/utils/copySrcFiles';
import BlankLayout from '../src/layout/blankLayout';
import { WithExceptionOpChildren } from '../src/component/Exception';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import { join } from 'path';

const fixtures = join(__dirname, '..', 'fixtures');

if (!window.matchMedia) {
  Object.defineProperty(global.window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: jest.fn((query) => ({
      matches: query.includes('max-width'),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })),
  });
}

beforeEach(async () => {
  console.error = jest.fn();
  copySrcFiles({
    cwd: join(__dirname, '../src'),
    absTmpPath: fixtures,
    config: { hasAccess: false },
  });
});

describe('getLayoutRenderConfig', () => {
  const Layout = require(join(
    fixtures,
    'plugin-layout',
    'layout',
    'layout',
    'index.tsx',
  )).default;
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
    const layoutConfig = getLayoutRenderConfig({
      layout: {},
      hideFooter: true,
    });
    expect(layoutConfig.footerRender).toBeFalsy();
  });

  it('BlankLayout', () => {
    const { container } = render(<BlankLayout>Hello, World!</BlankLayout>);
    expect(container.firstChild).toMatchInlineSnapshot(`Hello, World!`);
  });

  it('ProLayout', () => {
    const { container } = render(
      <Layout location={{ pathname: '/' }}>Hello, World!</Layout>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('ProLayout rightContentRender', () => {
    const { container } = render(
      <Layout location={{ pathname: '/' }} rightContentRender={() => 'name'}>
        Hello, World!
      </Layout>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('ProLayout rightContentRender', () => {
    const { container } = render(
      <Layout
        location={{ pathname: '/' }}
        userConfig={{
          childrenRender: () => 'hello childrenRender',
        }}
        rightContentRender={() => 'name'}
      >
        Hello, World!
      </Layout>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('ProLayout patchMenus', () => {
    const { container } = render(
      <BrowserRouter>
        <Layout
          location={{ pathname: '/' }}
          userConfig={{
            patchMenus: () => [
              {
                name: 'qixian',
                path: '/',
              },
              {
                name: 'qixian2',
                path: '/qixian',
              },
            ],
          }}
          rightContentRender={() => 'name'}
        >
          Hello, World!
        </Layout>
      </BrowserRouter>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('WithExceptionOpChildren 404', () => {
    const { container } = render(
      <WithExceptionOpChildren location={{ pathname: '/' }}>
        Hello, World!
      </WithExceptionOpChildren>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('WithExceptionOpChildren 403', () => {
    const { container } = render(
      <WithExceptionOpChildren
        currentPathConfig={{ unAccessible: true }}
        location={{ pathname: '/' }}
      >
        Hello, World!
      </WithExceptionOpChildren>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('WithExceptionOpChildren is ok', () => {
    const { container } = render(
      <WithExceptionOpChildren
        currentPathConfig={{ unAccessible: false }}
        location={{ pathname: '/' }}
      >
        Hello, World!
      </WithExceptionOpChildren>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
