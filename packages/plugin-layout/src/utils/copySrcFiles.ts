import { utils } from 'umi';
import { join } from 'path';
import { readFileSync, copyFileSync, statSync, writeFileSync } from 'fs';

export default ({
  cwd,
  absTmpPath,
  config,
}: {
  cwd: string;
  absTmpPath: string;
  config: object;
}) => {
  const files = utils.glob.sync('**/*', {
    cwd,
  });
  const base = join(absTmpPath, 'plugin-layout', 'layout');
  utils.mkdirp.sync(base);
  files.forEach(async (file) => {
    if (['index.ts', 'runtime.tsx.tpl'].includes(file)) return;
    const source = join(cwd, file);
    const target = join(base, file);
    if (statSync(source).isDirectory()) {
      utils.mkdirp.sync(target);
    } else {
      if (target.endsWith('.tpl')) {
        const sourceContent = readFileSync(source, 'utf-8');
        await writeFileSync(
          target.replace(/\.tpl$/, ''),
          utils.Mustache.render(sourceContent, config),
          'utf-8',
        );
      } else {
        await copyFileSync(source, target);
      }
    }
  });
};
