import { utils } from 'umi';
import { readFileSync } from 'fs';
import { join } from 'path';

export function getModels(opts: { base: string; pattern?: string }) {
  return utils.glob
    .sync(opts.pattern || '**/*.{ts,tsx,js,jsx}', {
      cwd: opts.base,
    })
    .filter(f => {
      if (/\.d.ts$/.test(f)) return false;
      if (/\.(test|spec).(j|t)sx?$/.test(f)) return false;
      // TODO: fs cache for performance
      return isValidModel({
        content: readFileSync(join(opts.base, f), 'utf-8'),
      });
    });
}

function getIdentifierDeclaration(
  node: utils.traverse.Node,
  path: utils.traverse.NodePath,
) {
  if (utils.t.isIdentifier(node) && path.scope.hasBinding(node.name)) {
    let bindingNode = path.scope.getBinding(node.name)!.path.node;
    if (utils.t.isVariableDeclarator(bindingNode)) {
      bindingNode = bindingNode.init!;
    }
    return bindingNode;
  }
  return node;
}

function getTSNode(node) {
  if (
    // <Model> {}
    utils.t.isTSTypeAssertion(node) ||
    // {} as Model
    utils.t.isTSAsExpression(node)
  ) {
    return node.expression;
  } else {
    return node;
  }
}

export function isValidModel({ content }: { content: string }) {
  const { parser } = utils;
  const ast = parser.parse(content, {
    sourceType: 'module',
    plugins: [
      'typescript',
      'classProperties',
      'dynamicImport',
      'exportDefaultFrom',
      'exportNamespaceFrom',
      'functionBind',
      'nullishCoalescingOperator',
      'objectRestSpread',
      'optionalChaining',
      'decorators-legacy',
    ],
  });

  let isDvaModel = false;
  let imports = {};

  // TODO: 补充更多用例
  // 1. typescript 用法
  // 2. dva-model-extend 用法
  utils.traverse.default(ast as any, {
    ImportDeclaration(path) {
      const { specifiers, source } = path.node;
      specifiers.forEach(specifier => {
        if (utils.t.isImportDefaultSpecifier(specifier)) {
          imports[specifier.local.name] = source.value;
        }
      });
    },
    ExportDefaultDeclaration(path: utils.traverse.NodePath) {
      let node = (path as { node: utils.t.ExportDefaultDeclaration }).node
        .declaration;

      node = getTSNode(node);
      node = getIdentifierDeclaration(node, path);
      node = getTSNode(node);

      // 支持 dva-model-extend
      if (
        utils.t.isCallExpression(node) &&
        utils.t.isIdentifier(node.callee) &&
        imports[node.callee.name] === 'dva-model-extend'
      ) {
        node = node.arguments[1];

        node = getTSNode(node);
        node = getIdentifierDeclaration(node, path);
        node = getTSNode(node);
      }

      if (
        utils.t.isObjectExpression(node) &&
        node.properties.some(property => {
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
