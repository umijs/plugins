const { resolve } = require('path');
const { writeFileSync } = require('fs');
const { getPkgName } = require('../utils/getPkgName');

const TMP_DIR = '.electron';
const TMP_DIR_PRODUCTION = '.electron-production';

const getTmpDir = (mode) => {
  return mode === 'development' ? TMP_DIR : TMP_DIR_PRODUCTION;
};

const deps = new Set(); // 搜集所有依赖
const depsOfFile = {}; // 搜集文件依赖
const filesOfDep = {}; // 搜集依赖所在文件
/**
 * @param {'production' | 'development'} mode
 * @param {Set} toGenerateDeps
 */
const generateDeps = (mode, toGenerateDeps) => {
  writeFileSync(
    resolve(process.cwd(), `${getTmpDir(mode)}/dependencies.json`),
    JSON.stringify(
      {
        all: Array.from(toGenerateDeps),
        files: Object.keys(depsOfFile).reduce((memo, current) => {
          return {
            ...memo,
            [current]: Array.from(depsOfFile[current]),
          };
        }, {}),
        deps: Object.keys(filesOfDep).reduce((memo, current) => {
          return {
            ...memo,
            [current]: Array.from(filesOfDep[current]),
          };
        }, {}),
      },
      null,
      2,
    ),
  );
};

export default (mode) => ({
  entry: resolve(process.cwd(), 'src/main/index.ts'),
  cjs: {
    type: 'babel',
  },
  target: 'node',
  disableTypeCheck: true,
  extraBabelPlugins: [
    [
      require('../features/package-analyze/babel-plugin-import-analyze'),
      {
        onCollect: (filename, depName) => {
          let finalDepName = getPkgName(depName);
          if (!finalDepName) {
            return;
          }
          deps.add(finalDepName);
          if (!depsOfFile[filename]) {
            depsOfFile[filename] = new Set();
          }
          if (!filesOfDep[finalDepName]) {
            filesOfDep[finalDepName] = new Set();
          }
          filesOfDep[finalDepName].add(filename);
          depsOfFile[filename].add(finalDepName);
          generateDeps(mode, deps);
        },
      },
    ],
  ],
});
