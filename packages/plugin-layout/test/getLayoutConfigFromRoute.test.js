import getLayoutConfigFromRoute from '../src/utils/getLayoutConfigFromRoute';
import { normalRoute } from './routes/normal';
import { simpleRoute } from './routes/simple';
import { prefixRoute } from './routes/prefix';

describe('getLayoutConfigFromRoute', () => {
  /**
   * 测试了以下场景：
   *  1. 路由默认包含 layout
   *  2. 隐藏 layout 配置
   *  3. 只隐藏侧边栏
   *  4. 只隐藏导航头
   */
  test('normal', () => {
    const LayoutConfig = getLayoutConfigFromRoute(normalRoute);
    expect(LayoutConfig).toEqual({
      '/': { hideMenu: true, hideNav: true, unAccessible: false },
      '/welcome': { hideMenu: false, hideNav: false, unAccessible: false },
      '/test': { hideMenu: false, hideNav: false, unAccessible: false },
      '/test/1': { hideMenu: true, hideNav: false, unAccessible: false },
      '/test233': { hideMenu: false, hideNav: true, unAccessible: false },
      '/test_hide': { hideMenu: false, hideNav: false, unAccessible: false },
    });
  });

  /**
   * 测试了以下场景:
   *  1. 子路由继承父路由 layout 配置
   *  2. 子路由优先级更高
   */
  test('simple', () => {
    const LayoutConfig = getLayoutConfigFromRoute(simpleRoute);
    expect(LayoutConfig).toEqual({
      '/': { hideMenu: true, hideNav: false, unAccessible: false },
      '/welcome': { hideMenu: false, hideNav: false, unAccessible: false },
      '/test': { hideMenu: true, hideNav: true, unAccessible: false },
      '/test/1': { hideMenu: true, hideNav: true, unAccessible: false },
      '/test233': { hideMenu: true, hideNav: false, unAccessible: false },
      '/test_hide': { hideMenu: true, hideNav: true, unAccessible: false },
    });
  });

  /**
   * 前缀
   * 测试了以下场景：
   *  1. history: 'hash'
   */
  test('prefix', () => {
    const LayoutConfig = getLayoutConfigFromRoute(prefixRoute);
    expect(LayoutConfig).toEqual({
      '/': { hideMenu: true, hideNav: false, unAccessible: false },
      '/welcome': { hideMenu: false, hideNav: false, unAccessible: false },
      '/test': { hideMenu: true, hideNav: true, unAccessible: false },
      '/test/1': { hideMenu: true, hideNav: true, unAccessible: false },
      '/test233': { hideMenu: true, hideNav: false, unAccessible: false },
      '/test_hide': { hideMenu: true, hideNav: true, unAccessible: false },
    });
  });
});
