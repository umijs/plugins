import { MenuDataItem } from '@umijs/route-utils';

/**
 * 广度优先匹配路由
 * @param tree 路由树
 * @param path 访问路径
 */
function breadthMatchRoute(tree: MenuDataItem[], path: string) {
  let stark: MenuDataItem[] = [];

  stark = stark.concat(tree);

  while (stark.length) {
    const temp = stark.shift();
    if (temp.children) {
      stark = stark.concat(temp.children);
    }
    if (temp.path === path) {
      return temp;
    }
  }
}
export default breadthMatchRoute;
