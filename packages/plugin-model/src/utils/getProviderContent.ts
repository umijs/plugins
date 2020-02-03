import { join } from 'path';
import { EOL } from 'os';
import { utils } from 'umi';

import {
  genImports,
  genModels,
  genExtraModels,
  ModelItem,
  getValidFiles,
} from './index';

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

export default function(modelsDir: string, extra: ModelItem[] = []) {
  const files = getValidFiles(getFiles(modelsDir), modelsDir);
  const imports = genImports(files);
  const userModels = getModels(files);
  const extraModels = getExtraModels(extra);
  const extraImports = getExtraImports(extra);
  return `import React from 'react';
${extraImports}
${imports}
// @ts-ignore
import Dispatcher from '${winPath(
    join(__dirname, '..', 'helpers', 'dispatcher'),
  )}';
// @ts-ignore
import Executor from '${winPath(join(__dirname, '..', 'helpers', 'executor'))}';
// @ts-ignore
import { UmiContext } from '${winPath(
    join(__dirname, '..', 'helpers', 'constant'),
  )}';

export const models = { ${extraModels ? `${extraModels}, ` : ''}${userModels} };

export type Model<T extends keyof typeof models> = {
  [key in keyof typeof models]: ReturnType<typeof models[T]>;
};

export type Models<T extends keyof typeof models> = Model<T>[T]

const dispatcher = new Dispatcher!();
const Exe = Executor!;

export default ({ children }: { children: React.ReactNode }) => {

  return (
    <UmiContext.Provider value={dispatcher}>
      {
        Object.entries(models).map(pair => (
          <Exe key={pair[0]} namespace={pair[0]} hook={pair[1] as any} onUpdate={(val: any) => {
            const [ns] = pair as [keyof typeof models, any];
            dispatcher.data[ns] = val;
            dispatcher.update(ns);
          }} />
        ))
      }
      {children}
    </UmiContext.Provider>
  )
}
`;
}
