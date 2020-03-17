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
        unaccessible: false,
        routes: null,
      },
      {
        path: '/admin',
        access: 'canReadAdminPage',
        unaccessible: true,
        routes: [
          {
            path: '/adminList',
            access: 'canReadAdminList',
            unaccessible: false,
          },
          {
            path: '/adminDetail',
            access: 'canReadAdminDetail',
            unaccessible: true,
          },
        ],
      },
      {
        path: '/user',
        access: 'canReadUser',
        unaccessible: false,
        routes: [
          {
            path: '/userDetail',
            access: 'canReadUserDetail',
            unaccessible: false,
          },
        ],
      },
      {
        path: '/order',
        access: 'canReadOrder',
        unaccessible: true,
        routes: [
          {
            path: '/orderAudit',
            access: 'canReadOrderAudit',
            unaccessible: true,
          },
          {
            path: '/orderCancellation',
            access: 'canReadOrderCancellation',
            unaccessible: true,
          },
        ],
      },
      {
        path: '/about',
        access: 'canReadAbout',
        unaccessible: false,
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
