import getProviderContent from './getProviderContent';
import getUseModelContent from './getUseModelContent';
import { EOL } from 'os';
import { utils } from 'umi';
import {
  genImports,
  genModels,
  genExtraModels,
  getValidFiles,
  ModelItem,
} from '.';

const { winPath } = utils;

function getFiles(cwd: string) {
  return utils.glob
    .sync('./**/*.{ts,tsx,js,jsx}', {
      cwd,
    })
    .filter(
      (file: string) =>
        !file.endsWith('.d.ts') &&
        !file.endsWith('.test.js') &&
        !file.endsWith('.test.jsx') &&
        !file.endsWith('.test.ts') &&
        !file.endsWith('.test.tsx'),
    );
}

function getModels(files: string[]) {
  const sortedModels = genModels(files);
  return sortedModels
    .map(ele => `'${ele.namespace.replace(/'/g, "\\'")}': ${ele.importName}`)
    .join(', ');
}

function getExtraModels(models: ModelItem[] = []) {
  const extraModels = genExtraModels(models);
  return extraModels
    .map(ele => `'${ele.namespace}': ${winPath(ele.importName)}`)
    .join(', ');
}

function getExtraImports(models: ModelItem[] = []) {
  const extraModels = genExtraModels(models);
  return extraModels
    .map(
      ele =>
        `import ${ele.importName} from '${winPath(
          ele.importPath.replace(/'/g, "\\'"),
        )}';`,
    )
    .join(EOL);
}

export const getTmpFile = (modelsDir: string, extra: ModelItem[] = []) => {
  const files = getValidFiles(getFiles(modelsDir), modelsDir);
  const imports = genImports(files);
  const userModels = getModels(files);
  const extraImports = getExtraImports(extra);
  const extraModels = getExtraModels(extra);
  const enable = Boolean(imports || extraImports);

  return {
    providerContent: getProviderContent(
      imports,
      userModels,
      extraImports,
      extraModels,
    ),
    useModelContent: enable
      ? getUseModelContent()
      : 'export const useModel = undefined;',
  };
};
