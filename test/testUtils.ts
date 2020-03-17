import { Service } from 'umi';
import { render as renderTL } from '@testing-library/react';
import { join } from 'path';

export async function generateTmp(opts: { cwd: string }) {
  const service = new Service({
    cwd: opts.cwd,
    plugins: [require.resolve('./plugin/plugin.ts')],
  });
  await service.run({
    name: 'g',
    args: {
      _: ['g', 'tmp'],
    },
  });
}

export function render(opts: { cwd: string }) {
  return renderTL(require(join(opts.cwd, '.umi-test', 'umi.ts')).default);
}
