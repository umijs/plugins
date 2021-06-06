/**
 * copy from https://github.com/umijs/plugins/blob/master/packages/plugin-initial-state/src/utils/shouldPluginEnable.ts#L7
 */

import type { ParserPlugin } from '@babel/parser';
import { readFileSync } from 'fs';
import { extname } from 'path';
import { utils } from 'umi';

const { t, parser } = utils;

// TODO 待 https://github.com/umijs/umi/pull/4909 合并后改为 umi 中的实现
export function hasExportWithName(opts: { name: string; filePath: string }) {
  const { name, filePath } = opts;

  const content = readFileSync(filePath, 'utf-8');
  const isTS = extname(filePath) === '.ts';
  const isTSX = extname(filePath) === '.tsx';

  const p: ParserPlugin[] = [];
  if (!isTS) {
    p.push('jsx');
  }
  if (isTS || isTSX) {
    p.push('typescript');
  }

  const ast = parser.parse(content, {
    sourceType: 'module',
    // @ts-ignore
    plugins: [
      ...p,
      // 支持更多语法
      'classProperties',
      'dynamicImport',
      'exportDefaultFrom',
      'exportNamespaceFrom',
      'functionBind',
      'nullishCoalescingOperator',
      'objectRestSpread',
      'optionalChaining',
      'decorators-legacy',
    ] as any[],
  });

  let hasExport = false;
  ast.program.body.forEach((node) => {
    if (t.isExportNamedDeclaration(node)) {
      if (node.declaration) {
        // export function xxx(){};
        if (t.isFunctionDeclaration(node.declaration)) {
          const id = node.declaration.id;
          if (t.isIdentifier(id) && id.name === name) {
            hasExport = true;
          }
        }

        // export const xxx = () => {};
        if (
          t.isVariableDeclaration(node.declaration) &&
          node.declaration.declarations
        ) {
          if (
            node.declaration.declarations.some((declaration) => {
              return (
                t.isVariableDeclarator(declaration) &&
                t.isIdentifier(declaration.id) &&
                declaration.id.name === name
              );
            })
          ) {
            hasExport = true;
          }
        }
      }

      // export { getInitialState };
      if (
        node.specifiers &&
        // @ts-ignore
        node.specifiers.some((specifier) => specifier.exported.name === name)
      ) {
        hasExport = true;
      }
    }
  });

  return hasExport;
}
