import { Service } from 'umi';

export async function generateTmp(opts: { cwd: string; plugin: string }) {
  const service = new Service({
    cwd: opts.cwd,
    plugins: [require.resolve('./plugin/plugin.ts'), opts.plugin],
  });
  await service.run({
    name: 'g',
    args: {
      _: ['g', 'tmp'],
    },
  });
}
