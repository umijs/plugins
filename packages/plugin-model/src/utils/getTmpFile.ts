import getProviderContent from './getProviderContent';
import getUseModelContent from './getUseModelContent';
import { EOL } from 'os';
import { utils } from 'umi';
import { genImports, genModels, genExtraModels, ModelItem } from '.';

const { winPath } = utils;

function getModels(files: string[], srcDirPath: string[]) {
  const sortedModels = genModels(files, srcDirPath);
  return sortedModels
    .map(ele => `'${ele.namespace.replace(/'/g, "\\'")}': ${ele.importName}`)
    .join(', ');
}

function getExtraModels(models: ModelItem[] = []) {
  const extraModels = genExtraModels(models);
  return extraModels
    .map(ele => `'${ele.namespace}': ${ele.exportName || ele.importName}`)
    .join(', ');
}

function getExtraImports(models: ModelItem[] = []) {
  const extraModels = genExtraModels(models);
  return extraModels
    .map(ele => {
      if (ele.exportName) {
        return `import { ${ele.exportName} } from '${winPath(
          ele.importPath.replace(/'/g, "\\'"),
        )}';`;
      }
      return `import ${ele.importName} from '${winPath(
        ele.importPath.replace(/'/g, "\\'"),
      )}';`;
    })
    .join(EOL);
}

export const getTmpFile = (
  files: string[],
  extra: ModelItem[] = [],
  srcDirPath: string[],
) => {
  const imports = genImports(files);
  const userModels = getModels(files, srcDirPath);
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
