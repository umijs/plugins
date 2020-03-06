import { readFileSync } from 'fs';
// @ts-ignore
import { init, parse } from 'es-module-lexer/dist/lexer.cjs';

export const shouldPluginEnable = async (entryFile?: string) => {
  let hasExport = false;

  if (entryFile) {
    await init;
    const fileContent = readFileSync(entryFile, 'utf-8');
    const [_, exportsList] = parse(fileContent);
    hasExport = exportsList.includes('getInitialState');
  }

  return hasExport;
};
