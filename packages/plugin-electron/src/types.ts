// 文件=>使用的依赖 映射
type Files = {
  [filePath: string]: string[];
};
// 依赖=>存在的文件 映射
type Deps = {
  [dep: string]: string[];
};

export type DependenciesJson = {
  all: string[];
  files: Files;
  deps: Deps;
};
