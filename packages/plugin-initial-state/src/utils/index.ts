import { utils } from 'umi';
import { readFileSync } from 'fs';

const { parser } = utils;

export const shouldPluginEnable = (entryFile?: string) => {
  let hasExport = false;

  if (entryFile) {
    const fileContent = readFileSync(entryFile, 'utf-8');
    const ast = parser.parse(fileContent, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });

    ast.program.body.forEach(ele => {
      if (ele.type === 'ExportNamedDeclaration') {
        try {
          // export const xxx = () => {};
          // export function xxx(){};
          if ((ele.declaration[0].id.name = 'getInitialState')) {
            hasExport = true;
          }
        } catch (e) {}

        try {
          // export { getInitialState };
          if (
            ele.specifiers.some(exp => exp.exported.name === 'getInitialState')
          ) {
            hasExport = true;
          }
        } catch (e) {}
      }
    });
  }

  return hasExport;
};
