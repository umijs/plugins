import breadthMatchRoute from '../src/utils/breadthMatchRoute';
import { normalMenu } from './routes/normal';

describe('breadthMatchRoute', () => {
  /**
   * 测试了以下场景：
   *  1. 匹配到路由
   */
  test('existence', () => {
    const matchedMenu = breadthMatchRoute(normalMenu, '/test233');
    expect(matchedMenu.path).toEqual('/test233');
  });

  /**
   * 测试了以下场景:
   *  1. 匹配不到路由
   */
  test('non-existence', () => {
    const matchedMenu = breadthMatchRoute(normalMenu, '/non-existence');
    expect(matchedMenu).toEqual(undefined);
  });
});
