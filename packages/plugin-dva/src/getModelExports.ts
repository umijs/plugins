import { readFileSync } from 'fs';
import { basename, dirname, extname } from 'path';
import ts from 'typescript';
import { utils } from 'umi';
import { tsquery } from '@phenomnomnominal/tsquery';

export function getModelExports(path: string) {
  const defaultNamespace = basename(path, extname(path));
  const pathWithoutExt = utils.winPath(
    `${dirname(path)}/${basename(path, extname(path))}`,
  );
  const key = `Model${Math.random()
    .toString(36)
    .slice(2)}`;

  const code = readFileSync(path, 'utf8');
  const source = ts.createSourceFile('', code, ts.ScriptTarget.Latest, true);
  const exportObject = getExportDefaultNode(source);
  if (!exportObject)
    return { key, pathWithoutExt, namespace: defaultNamespace };

  const effectsNodes = exportObject.properties.filter(
    (prop): prop is ts.PropertyAssignment =>
      prop.kind === ts.SyntaxKind.PropertyAssignment &&
      prop.name?.getText() === 'effects',
  );
  const reducersNodes = exportObject.properties.filter(
    (prop): prop is ts.PropertyAssignment =>
      prop.kind === ts.SyntaxKind.PropertyAssignment &&
      prop.name?.getText() === 'reducers',
  );
  const namespaceNodes = exportObject.properties.filter(
    (prop): prop is ts.PropertyAssignment =>
      prop.kind === ts.SyntaxKind.PropertyAssignment &&
      prop.name?.getText() === 'namespace',
  );

  const effectsNode = effectsNodes[effectsNodes.length - 1];
  const reducersNode = reducersNodes[reducersNodes.length - 1];
  const namespaceNode = namespaceNodes[namespaceNodes.length - 1];

  const namespaceValue = isStringLiteral(namespaceNode?.initializer)
    ? namespaceNode.initializer.text
    : null;

  return {
    key,
    pathWithoutExt,
    effects: effectsNode && getPropertyKeysOfPropertyAssignment(effectsNode),
    reducers: reducersNode && getPropertyKeysOfPropertyAssignment(reducersNode),
    namespace: namespaceValue ?? defaultNamespace,
  };
}

function getExportDefaultNode(
  node: ts.SourceFile,
): ts.ObjectLiteralExpression | undefined {
  const exportAssignments = tsquery(node, `SourceFile > ExportAssignment`);
  const exportAssignment = exportAssignments[exportAssignments.length - 1];

  if (!exportAssignment) return;

  const exportObjects = tsquery(
    exportAssignment,
    `ExportAssignment > ObjectLiteralExpression`,
  ) as ts.ObjectLiteralExpression[];

  if (exportObjects.length) return exportObjects[exportObjects.length - 1];

  const identifiers = tsquery(
    exportAssignment,
    `ExportAssignment > Identifier`,
  );

  if (identifiers.length) {
    const identifier = identifiers[identifiers.length - 1] as ts.Identifier;
    const variableObjects = tsquery(
      node,
      `SourceFile \
        > VariableStatement \
          > VariableDeclarationList \
            > VariableDeclaration:has(Identifier[name="${identifier.getText()}"]) \
              > ObjectLiteralExpression`,
    ) as ts.ObjectLiteralExpression[];

    if (variableObjects.length)
      return variableObjects[variableObjects.length - 1];
  }

  return;
}

function getPropertyKeysOfPropertyAssignment(
  node: ts.PropertyAssignment,
): string[] {
  if (!isObjectLiteralExpression(node.initializer)) return [];

  return node.initializer.properties
    .map(prop => prop.name?.getText())
    .filter((prop): prop is string => prop !== undefined);
}

function isStringLiteral(node: ts.Node | undefined): node is ts.StringLiteral {
  return !!node && node.kind === ts.SyntaxKind.StringLiteral;
}

function isObjectLiteralExpression(
  node: ts.Node | undefined,
): node is ts.ObjectLiteralExpression {
  return !!node && node.kind === ts.SyntaxKind.ObjectLiteralExpression;
}
