import { addSpecifyPrefixedRoute } from './addSpecifyPrefixedRoute';

const originRoutes = [
  {
    path: '/',
    routes: [
      {
        path: '/',
        exact: true,
        _title: 'app2',
        _title_default: 'app2',
      },
      {
        path: '/user',
        exact: true,
        _title: 'app2',
        _title_default: 'app2',
      },
      {
        _title: 'app2',
        _title_default: 'app2',
      },
    ],
    _title: 'app2',
    _title_default: 'app2',
  },
  {
    _title: 'app2',
    _title_default: 'app2',
  },
];

const expectRoutes = [
  {
    path: '/app2',
    routes: [
      {
        path: '/',
        exact: true,
        _title: 'app2',
        _title_default: 'app2',
      },
      {
        path: '/test/user',
        exact: true,
        _title: 'app2',
        _title_default: 'app2',
      },
      {
        _title: 'app2',
        _title_default: 'app2',
      },
    ],
    _title: 'app2',
    _title_default: 'app2',
  },
  {
    path: '/',
    routes: [
      {
        path: '/',
        exact: true,
        _title: 'app2',
        _title_default: 'app2',
      },
      {
        path: '/user',
        exact: true,
        _title: 'app2',
        _title_default: 'app2',
      },
      {
        _title: 'app2',
        _title_default: 'app2',
      },
    ],
    _title: 'app2',
    _title_default: 'app2',
  },
  {
    _title: 'app2',
    _title_default: 'app2',
  },
];

test('addSpecifyPrefixedRoute', () => {
  // 在原route的基础上添加指定路由单测
  expect(String(addSpecifyPrefixedRoute(originRoutes, 'test'))).toEqual(
    String(expectRoutes),
  );
  expect(String(addSpecifyPrefixedRoute(originRoutes, 'test', 'app2'))).toEqual(
    String(expectRoutes),
  );
  expect(String(addSpecifyPrefixedRoute(originRoutes, true, 'test'))).toEqual(
    String(expectRoutes),
  );
});
