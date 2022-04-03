import { join } from 'path';
import { difference } from 'lodash';
import { log } from '../../utils';
import chalk from 'chalk';
import { TMP_DIR } from '../../constants';

const ignoreDeps = [
  'electron',
  'original-fs',
  'assert',
  'async_hooks',
  'buffer',
  'child_process',
  'cluster',
  'console',
  'crypto',
  'debugger',
  'dgram',
  'diagnostics_channel',
  'dns',
  'domain',
  'events',
  'fs',
  'global',
  'http',
  'http2',
  'https',
  'inspector',
  'module',
  'net',
  'os',
  'path',
  'perf_hooks',
  'process',
  'punycode',
  'querystring',
  'readline',
  'repl',
  'report',
  'stream',
  'string_decoder',
  'timers',
  'tls',
  'trace_events',
  'tty',
  'url',
  'util',
  'v8',
  'vm',
  'wasi',
  'webcrypto',
  'worker_threads',
  'zlib',
  'node:stream/web', // WebStream
  'electron-lab',
];

type Opts = {
  throwWhileUnusedDependencies: boolean;
};

export const packageAnalyze = (opts?: Partial<Opts>): void => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const userPkg = require(join(process.cwd(), 'package.json'));
  const userDeps: string[] = Object.keys(userPkg.dependencies || {});
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const analyzeResult = require(join(
    process.cwd(),
    `${TMP_DIR}/dependencies.json`,
  ));
  const analyzedDeps: string[] = difference(analyzeResult.all, ignoreDeps);

  const unusedPkg = difference(userDeps, analyzedDeps);
  const unInstallPkg = difference(analyzedDeps, userDeps);
  if (unusedPkg.length) {
    log.warn(
      `found unused dependencies: ${unusedPkg
        .map((_) => `${chalk.yellow(_)}`)
        .join(', ')}, remove them to devDependencies reduce package size.`,
    );
    if (opts?.throwWhileUnusedDependencies) {
      throw new Error('unused packages.');
    }
  }

  if (userDeps.includes('electron-lab')) {
    log.error('electron-lab should not in dependencies field!');
    throw new Error('invalid dependent.');
  }

  if (unInstallPkg.length) {
    log.error(
      `dependencies ${unInstallPkg
        .map((_) => chalk.redBright(_))
        .join(', ')} not found!\ntry ${chalk.green(
        `\`$ yarn add ${unInstallPkg.join(' ')}\``,
      )} to fix this problem.\nor remove them:`,
    );
    console.log(
      unInstallPkg
        .map((pkg) => `${pkg}:\n${analyzeResult.deps[pkg].join('\n')}`)
        .join('\n'),
    );
    throw new Error('lost packages.');
  }
};
