import { IRoute } from 'umi';
import { traverseModifyRoutes } from '../../src/utils/runtimeUtil';

let routes: IRoute[] = [];
const access = {
  canReadHomepage: () => true,
  canReadAdminPage: () => false,
  canReadAdminList: () => true,
  canReadAdminDetail: () => false,
  canReadUser: () => true,
  canReadUserDetail: () => true,
  canReadOrder: () => true,
  canReadOrderAudit: () => false,
  canReadOrderCancellation: () => false,
  canReadAbout: true,
};

describe('TraverseModifyRoutes', () => {
  beforeEach(() => {
    routes = [
      {
        path: '/homepage',
        access: 'canReadHomepage',
        routes: null as any,
      },
      {
        path: '/admin',
        access: 'canReadAdminPage',
        routes: [
          {
            path: '/adminList',
            access: 'canReadAdminList',
          },
          {
            path: '/adminDetail',
            access: 'canReadAdminDetail',
          },
        ],
      },
      {
        path: '/user',
        access: 'canReadUser',
        routes: [
          {
            path: '/userDetail',
            access: 'canReadUserDetail',
          },
        ],
      },
      {
        path: '/order',
        access: 'canReadOrder',
        routes: [
          {
            path: '/orderAudit',
            access: 'canReadOrderAudit',
          },
          {
            path: '/orderCancellation',
            access: 'canReadOrderCancellation',
          },
        ],
      },
      {
        path: '/about',
        access: 'canReadAbout',
      },
    ];
  });

  it('should get expected accessible result', () => {
    const result = traverseModifyRoutes(routes, access);

    expect(result).toEqual([
      {
        path: '/homepage',
        access: 'canReadHomepage',
        unAccessible: false,
        routes: null,
      },
      {
        path: '/admin',
        access: 'canReadAdminPage',
        unAccessible: true,
        routes: [
          {
            path: '/adminList',
            access: 'canReadAdminList',
            unAccessible: false,
          },
          {
            path: '/adminDetail',
            access: 'canReadAdminDetail',
            unAccessible: true,
          },
        ],
      },
      {
        path: '/user',
        access: 'canReadUser',
        unAccessible: false,
        routes: [
          {
            path: '/userDetail',
            access: 'canReadUserDetail',
            unAccessible: false,
          },
        ],
      },
      {
        path: '/order',
        access: 'canReadOrder',
        unAccessible: true,
        routes: [
          {
            path: '/orderAudit',
            access: 'canReadOrderAudit',
            unAccessible: true,
          },
          {
            path: '/orderCancellation',
            access: 'canReadOrderCancellation',
            unAccessible: true,
          },
        ],
      },
      {
        path: '/about',
        access: 'canReadAbout',
        unAccessible: false,
      },
    ]);
  });

  it('should throw error if access of arbitrary route is not a string', () => {
    routes[0].access = () => {};
    expect(() => {
      traverseModifyRoutes(routes, access);
    }).toThrowError();
  });
});
