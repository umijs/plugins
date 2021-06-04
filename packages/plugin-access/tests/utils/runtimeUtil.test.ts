import { IRoute } from 'umi';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import getRuntimeUtil from '../../src/utils/getRuntimeUtil';

const tmpDir = join(__dirname, './.umi-test');

if (!existsSync(tmpDir)) {
  mkdirSync(tmpDir);
}

writeFileSync(join(tmpDir, './runtimeUtil.ts'), getRuntimeUtil());

type Routes = IRoute[];

type TtraverseModifyRoutes = (routes: Routes, access: any) => Routes;
const {
  traverseModifyRoutes,
}: {
  traverseModifyRoutes: TtraverseModifyRoutes;
} = require('./.umi-test/runtimeUtil');

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
    expect(result).toMatchSnapshot();
  });

  it('test no use code', () => {
    const result = traverseModifyRoutes(
      [
        {
          path: '/homepage',
          access: 'canReadHomepage',
          routes: {} as any,
        },
        {
          path: '/admin',
          access: 'canReadAdminPage',
          routes: [],
        },
        {
          path: '/order',
          access: 'canReadUser',
          routes: [
            {
              path: '/orderAudit',
              access: 'canReadOrderAudit',
            },
            {
              path: '/orderCancellation',
              access: 'canReadOrderAudit',
            },
          ],
        },
      ],
      access,
    );
    expect(result).toMatchSnapshot();
  });

  it('should throw error if access of arbitrary route is not a string', () => {
    routes[0].access = () => {};
    expect(() => {
      traverseModifyRoutes(routes, access);
    }).toThrowError();
  });
});
