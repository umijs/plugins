import { Service } from 'umi';

export async function generateTmp(opts: { cwd: string; plugins: string[] }) {
  const service = new Service({
    cwd: opts.cwd,
    plugins: [require.resolve('./plugin/plugin.ts'), ...(opts.plugins || [])],
  });
  await service.run({
    name: 'g',
    args: {
      _: ['g', 'tmp'],
    },
  });
}
