import { utils } from 'umi';
import { readFileSync } from 'fs';
import { join } from 'path';

export function getModels({ base }: { base: string }) {
  return utils.glob
    .sync('**/*.{ts,tsx,js,jsx}', {
      cwd: base,
    })
    .filter(f => {
      if (/\.d.ts$/.test(f)) return false;
      if (/\.(test|spec).(j|t)sx?$/.test(f)) return false;
      // TODO: fs cache for performance
      return isValidModel({ content: readFileSync(join(base, f), 'utf-8') });
    });
}

export function isValidModel({ content }: { content: string }) {
  const { parser } = utils;
  const ast = parser.parse(content, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  });

  let isDvaModel = false;

  // TODO: 补充更多用例
  // 1. typescript 用法
  // 2. dva-model-extend 用法
  utils.traverse.default(ast as any, {
    ExportDefaultDeclaration(path: utils.traverse.NodePath) {
      const { node } = path as { node: utils.t.ExportDefaultDeclaration };
      if (
        utils.t.isObjectExpression(node.declaration) &&
        node.declaration.properties.some(property => {
          return [
            'state',
            'reducers',
            'subscriptions',
            'effects',
            'namespace',
          ].includes((property as any).key.name);
        })
      ) {
        isDvaModel = true;
      }
    },
  });

  return isDvaModel;
}
