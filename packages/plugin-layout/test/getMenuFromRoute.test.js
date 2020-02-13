import getMenuFromRoute from '../src/utils/getMenuFromRoute';
import { normalRoute, normalMenu } from './routes/normal';
import { simpleRoute, simpleMenu } from './routes/simple';
import { prefixRoute, prefixMenu } from './routes/prefix';

describe('getMenuFromRoute', () => {
  /**
   * 推荐写法
   * 测试了以下场景：
   *  1. 子路由
   *  2. 兼容老的 name / icon 写法
   *  3. 相对路径 / 绝对路径
   *  4. indexRoute
   *  5. flatMenu 打平菜单
   *  6. 隐藏菜单
   */
  test('normal', () => {
    const menu = getMenuFromRoute(normalRoute);
    expect(menu).toEqual(normalMenu);
  });

  /**
   * 简易写法
   * 测试了以下场景:
   *  1. 平铺式写法，兼容老的配置写法
   *  2. hideChildren 隐藏子菜单
   */
  test('simple', () => {
    const menu = getMenuFromRoute(simpleRoute);
    expect(menu).toEqual(simpleMenu);
  });

  /**
   * 前缀
   * 测试了以下场景：
   *  1. 正确生成 OneX 需要的 mock 菜单数据
   */
  test('prefix', () => {
    const menu = getMenuFromRoute(prefixRoute, '#/$name');
    expect(menu).toEqual(prefixMenu);
  });
});
