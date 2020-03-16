import { readFileSync } from 'fs';
import { basename, extname } from 'path';
import ts from 'typescript';
import { tsquery } from '@phenomnomnominal/tsquery';

export function getModelExports(path: string) {
  const code = readFileSync(path, 'utf8');
  const source = ts.createSourceFile('', code, ts.ScriptTarget.Latest, true);
  const exportNode = getExportDefaultNode(source);
  const effectsNodes = tsquery(
    exportNode,
    `PropertyAssignment:has(Identifier[name=effects], StringLiteral[value=effects])`,
  ) as ts.PropertyAssignment[];
  const reducersNodes = tsquery(
    exportNode,
    `PropertyAssignment:has(Identifier[name=reducers], StringLiteral[value=reducers])`,
  ) as ts.PropertyAssignment[];
  const namespaceNodes = tsquery(
    exportNode,
    `PropertyAssignment:has(Identifier[name=namespace], StringLiteral[value=namespace]) \
      > StringLiteral`,
  ) as ts.StringLiteral[];

  const effectsNode = effectsNodes[effectsNodes.length - 1] as
    | ts.PropertyAssignment
    | undefined;
  const reducersNode = reducersNodes[reducersNodes.length - 1] as
    | ts.PropertyAssignment
    | undefined;
  const namespaceNode = namespaceNodes[namespaceNodes.length - 1] as
    | ts.StringLiteral
    | undefined;

  return {
    path,
    effects: effectsNode && getPropertyKeysOfPropertyAssignment(effectsNode),
    reducers: reducersNode && getPropertyKeysOfPropertyAssignment(reducersNode),
    namespace: namespaceNode?.text ?? basename(path, extname(path)),
  };
}

function getExportDefaultNode(node: ts.SourceFile) {
  const exportAssignments = tsquery(node, `SourceFile > ExportAssignment`);
  const exportAssignment = exportAssignments[exportAssignments.length - 1];

  if (!exportAssignment) return node;

  const exportObjects = tsquery(
    exportAssignment,
    `ExportAssignment > ObjectLiteralExpression`,
  );

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
    );

    if (variableObjects.length)
      return variableObjects[variableObjects.length - 1];
  }

  return node;
}

function getPropertyKeysOfPropertyAssignment(node: ts.PropertyAssignment) {
  const effectsProps = tsquery(
    node,
    `PropertyAssignment \
      > ObjectLiteralExpression \
        > PropertyAssignment`,
  ) as ts.PropertyAssignment[];

  return effectsProps
    .map(node => {
      const identifier = tsquery(
        node,
        `PropertyAssignment \
          > :matches(Identifier, ComputedPropertyName)`,
      ) as (ts.Identifier | ts.ComputedPropertyName)[];
      return identifier.length
        ? identifier[identifier.length - 1].getText()
        : null;
    })
    .filter((prop): prop is string => prop !== null);
}
