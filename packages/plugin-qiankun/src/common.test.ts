/**
 * @author Kuitos
 * @since 2019-10-22
 */
import 'jest';
import { testPathWithPrefix, insertRoute } from './common';

describe('testPathPrefix', () => {
  test('testPathPrefix', () => {
    // browser history
    expect(testPathWithPrefix('/js', '/')).toBeFalsy();

    expect(testPathWithPrefix('/js', '/js')).toBeTruthy();
    expect(testPathWithPrefix('/js', '/jss')).toBeFalsy();
    expect(testPathWithPrefix('/js', '/js/')).toBeTruthy();
    expect(testPathWithPrefix('/js', '/js/s')).toBeTruthy();
    expect(testPathWithPrefix('/js', '/js/s/a')).toBeTruthy();
    expect(testPathWithPrefix('/js', '/js/s?a=b')).toBeTruthy();
    expect(testPathWithPrefix('/js', '/js?a=b')).toBeTruthy();
    expect(testPathWithPrefix('/js', '/js?')).toBeTruthy();
    expect(testPathWithPrefix('/js', '/js/?')).toBeTruthy();
    expect(testPathWithPrefix('/js', '/js/?a=b')).toBeTruthy();

    // hash history
    expect(testPathWithPrefix('#/js', '#/js')).toBeTruthy();
    expect(testPathWithPrefix('#/js', '#/jss')).toBeFalsy();
    expect(testPathWithPrefix('#/js', '#/js/')).toBeTruthy();
    expect(testPathWithPrefix('#/js', '#/js/s')).toBeTruthy();
    expect(testPathWithPrefix('#/js', '#/js/s/a')).toBeTruthy();
    expect(testPathWithPrefix('#/js', '#/js/s?a=b')).toBeTruthy();
    expect(testPathWithPrefix('#/js', '#/js?a=b')).toBeTruthy();
    expect(testPathWithPrefix('#/js', '#/js?')).toBeTruthy();
    expect(testPathWithPrefix('#/js', '#/js/?')).toBeTruthy();
    expect(testPathWithPrefix('#/js', '#/js/?a=b')).toBeTruthy();

    // browser history with slash ending
    expect(testPathWithPrefix('/js/', '/js')).toBeFalsy();
    expect(testPathWithPrefix('/js/', '/jss')).toBeFalsy();
    expect(testPathWithPrefix('/js/', '/js/')).toBeTruthy();
    expect(testPathWithPrefix('/js/', '/js/s')).toBeTruthy();
    expect(testPathWithPrefix('/js/', '/js/s/a')).toBeTruthy();
    expect(testPathWithPrefix('/js/', '/js/s?a=b')).toBeTruthy();
    expect(testPathWithPrefix('/js/', '/js?a=b')).toBeFalsy();
    expect(testPathWithPrefix('/js/', '/js?')).toBeFalsy();
    expect(testPathWithPrefix('/js/', '/js/?')).toBeTruthy();
    expect(testPathWithPrefix('/js/', '/js/?a=b')).toBeTruthy();

    // hash history with slash ending
    expect(testPathWithPrefix('#/js/', '#/js')).toBeFalsy();
    expect(testPathWithPrefix('#/js/', '#/jss')).toBeFalsy();
    expect(testPathWithPrefix('#/js/', '#/js/')).toBeTruthy();
    expect(testPathWithPrefix('#/js/', '#/js/s')).toBeTruthy();
    expect(testPathWithPrefix('#/js/', '#/js/s/a')).toBeTruthy();
    expect(testPathWithPrefix('#/js/', '#/js/s?a=b')).toBeTruthy();
    expect(testPathWithPrefix('#/js/', '#/js?a=b')).toBeFalsy();
    expect(testPathWithPrefix('#/js/', '#/js?')).toBeFalsy();
    expect(testPathWithPrefix('#/js/', '#/js/?')).toBeTruthy();
    expect(testPathWithPrefix('#/js/', '#/js/?a=b')).toBeTruthy();

    // browser history with dynamic route
    expect(testPathWithPrefix('/:abc', '/js')).toBeTruthy();
    expect(testPathWithPrefix('/:abc', '/123')).toBeTruthy();
    expect(testPathWithPrefix('/:abc/', '/js/')).toBeTruthy();
    expect(testPathWithPrefix('/:abc/js', '/js/js')).toBeTruthy();
    expect(testPathWithPrefix('/:abc/js', '/js/123')).toBeFalsy();
    expect(testPathWithPrefix('/js/:abc', '/js/123')).toBeTruthy();
    expect(testPathWithPrefix('/js/:abc/', '/js/123')).toBeFalsy();
    expect(testPathWithPrefix('/js/:abc/jsx', '/js/123/jsx')).toBeTruthy();
    expect(
      testPathWithPrefix('/js/:abc/jsx', '/js/123/jsx/hello'),
    ).toBeTruthy();
    expect(testPathWithPrefix('/js/:abc/jsx', '/js/123')).toBeFalsy();
    expect(testPathWithPrefix('/js/:abc/jsx', '/js/123/css')).toBeFalsy();
    expect(
      testPathWithPrefix('/js/:abc/jsx/:cde', '/js/123/jsx/kkk'),
    ).toBeTruthy();
    expect(testPathWithPrefix('/js/:abc/jsx/:cde', '/js/123/jsk')).toBeFalsy();
    expect(
      testPathWithPrefix('/js/:abc/jsx/:cde', '/js/123/jsx/kkk/hello'),
    ).toBeTruthy();
    expect(testPathWithPrefix('/js/:abc?', '/js')).toBeTruthy();
    expect(testPathWithPrefix('/js/*', '/js/245')).toBeTruthy();

    // hash history with dynamic route
    expect(testPathWithPrefix('#/:abc', '#/js')).toBeTruthy();
    expect(testPathWithPrefix('#/:abc', '#/123')).toBeTruthy();
    expect(testPathWithPrefix('#/:abc/', '#/js/')).toBeTruthy();
    expect(testPathWithPrefix('#/:abc/js', '#/js/js')).toBeTruthy();
    expect(testPathWithPrefix('#/:abc/js', '#/js/123')).toBeFalsy();
    expect(testPathWithPrefix('#/js/:abc', '#/js/123')).toBeTruthy();
    expect(testPathWithPrefix('#/js/:abc/', '#/js/123')).toBeFalsy();
    expect(testPathWithPrefix('#/js/:abc/', '#/js/123/jsx')).toBeTruthy();
    expect(testPathWithPrefix('#/js/:abc/jsx', '#/js/123/jsx')).toBeTruthy();
    expect(
      testPathWithPrefix('#/js/:abc/jsx', '#/js/123/jsx/hello'),
    ).toBeTruthy();
    expect(
      testPathWithPrefix('#/js/:abc/jsx', '#/js/123/jsx/hello?test=1'),
    ).toBeTruthy();
    expect(testPathWithPrefix('#/js/:abc/jsx', '#/js/123')).toBeFalsy();
    expect(testPathWithPrefix('#/js/:abc/jsx', '#/js/123/css')).toBeFalsy();
    expect(
      testPathWithPrefix('#/js/:abc/jsx/:cde', '#/js/123/jsx/kkk'),
    ).toBeTruthy();
    expect(
      testPathWithPrefix('#/js/:abc/jsx/:cde', '#/js/123/jsx/kkk/hello'),
    ).toBeTruthy();
    expect(
      testPathWithPrefix('#/js/:abc/jsx/:cde', '#/js/123/jsk'),
    ).toBeFalsy();
    expect(testPathWithPrefix('#/js/:abc?', '#/js')).toBeTruthy();
    expect(testPathWithPrefix('#/js/*', '#/js/245')).toBeTruthy();
  });
});

describe('test insert route', () => {
  test('insert', () => {
    const mockRoutes = [{ path: '/a' }];
    insertRoute(mockRoutes, { path: '/a/b', insert: '/a' });
    expect(mockRoutes).toEqual([
      { path: '/a', exact: false, routes: [{ insert: '/a', path: '/a/b' }] },
    ]);
  });
  test('insert with children routes', () => {
    const mockRoutes = [{ path: '/a' }];
    insertRoute(mockRoutes, {
      path: '/a/b',
      insert: '/a',
      routes: [{ path: '/a/b/c' }],
    });
    expect(mockRoutes).toEqual([
      {
        path: '/a',
        exact: false,
        routes: [{ insert: '/a', path: '/a/b', routes: [{ path: '/a/b/c' }] }],
      },
    ]);
  });
  test('insert into children routes', () => {
    const mockRoutes = [{ path: '/a', routes: [{ path: '/a/b' }] }];
    insertRoute(mockRoutes, { path: '/a/b/c', insert: '/a/b' });
    expect(mockRoutes).toEqual([
      {
        path: '/a',
        routes: [
          {
            path: '/a/b',
            exact: false,
            routes: [{ path: '/a/b/c', insert: '/a/b' }],
          },
        ],
      },
    ]);
  });

  test('insert node does not exist', () => {
    const mockRoutes = [{ path: '/a' }];
    const mockInsert = { path: '/a/b', insert: '/b' };
    const errorFn = jest.fn();
    try {
      insertRoute(mockRoutes, mockInsert);
    } catch (e) {
      errorFn();
      expect(e.message).toEqual(
        `[plugin-qiankun]: path "${mockInsert.insert}" not found`,
      );
    }
    expect(errorFn).toBeCalled();
  });

  test('insert path does not follow hierarchy', () => {
    const mockRoutes = [{ path: '/a' }];
    const mockInsert = { path: '/b', insert: '/a' };
    const errorFn = jest.fn();
    try {
      insertRoute(mockRoutes, mockInsert);
    } catch (e) {
      errorFn();
      expect(e.message).toEqual(
        `[plugin-qiankun]: path "${mockInsert.path}" need to starts with "${mockRoutes[0].path}"`,
      );
    }
    expect(errorFn).toBeCalled();
  });
});
