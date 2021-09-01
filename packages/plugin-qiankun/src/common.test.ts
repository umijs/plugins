/**
 * @author Kuitos
 * @since 2019-10-22
 */
import 'jest';
import { testPathWithPrefix, insertMicroAppRoute } from './common';

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

describe('modifyRoutes', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'development';
  });

  test('should work with insert', () => {
    const mockRoutes = [{ path: '/a' }, { path: '/a/b', insert: '/a' }];
    insertMicroAppRoute({ routes: mockRoutes });
    expect(mockRoutes).toEqual([
      { path: '/a', exact: false, routes: [{ insert: '/a', path: '/a/b' }] },
    ]);
  });

  test('should work with nested insert', () => {
    const mockRoutes = [
      { path: '/a' },
      { path: '/a/d/b', insert: '/a/d' },
      { path: '/a/d/b/c', insert: '/a/d/b' },
      { path: '/a/d', insert: '/a' },
      {
        path: '/e',
        exact: false,
        routes: [{ path: '/e/f' }, { path: '/e/g' }],
      },
      { path: '/e/f/h', insert: '/e/f' },
    ];
    insertMicroAppRoute({ routes: mockRoutes });
    console.log(JSON.stringify(mockRoutes));
    expect(mockRoutes).toEqual([
      {
        path: '/a',
        routes: [
          {
            path: '/a/d',
            insert: '/a',
            routes: [
              {
                path: '/a/d/b',
                insert: '/a/d',
                routes: [{ path: '/a/d/b/c', insert: '/a/d/b' }],
                exact: false,
              },
            ],
            exact: false,
          },
        ],
        exact: false,
      },
      {
        path: '/e',
        exact: false,
        routes: [
          {
            path: '/e/f',
            routes: [{ path: '/e/f/h', insert: '/e/f' }],
            exact: false,
          },
          { path: '/e/g' },
        ],
      },
    ]);
  });

  test('should detect loop', () => {
    const mockRoutes = [
      { path: '/a/b', insert: '/a/b' },
      { path: '/a/b', insert: '/a/b' },
    ];

    const fn = jest.fn();

    try {
      insertMicroAppRoute({ routes: mockRoutes });
    } catch (e) {
      fn();
      expect(e.message).toEqual(
        '[insert-routes]: circular route insert detected',
      );
    }

    expect(fn).toBeCalled();
  });

  test('insert route should exist', () => {
    const mockRoutes = [{ path: '/a' }, { path: '/abc/b', insert: '/abc' }];
    const fn = jest.fn();

    try {
      insertMicroAppRoute({ routes: mockRoutes });
    } catch (e) {
      fn();
      expect(e.message).toEqual(
        '[insert-routes]: insert route not found for "/abc"',
      );
    }
    expect(fn).toBeCalled();
  });
});
