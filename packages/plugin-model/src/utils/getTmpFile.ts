import getProviderContent from './getProviderContent';
import getUseModelContent from './getUseModelContent';
import { EOL } from 'os';
import { utils } from 'umi';
import { genImports, genModels, genExtraModels, ModelItem } from '.';

const { winPath } = utils;

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

export const getTmpFile = (files: string[], extra: ModelItem[] = []) => {
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
