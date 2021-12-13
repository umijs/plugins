import { fork } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import path, { resolve, join } from 'path';
import chokidar from 'chokidar';
import { debounce } from 'lodash';
import { TMP_DIR } from './constants';
import { log } from './utils';

type FatherBuildCliOpts = {
  configPath?: string;
  src?: string;
  output?: string;
};

export type WatchReturnType = {
  exit: () => void;
};

type WatchOpts = {
  onBuild?: () => void;
};

class FatherBuildCli {
  private opts: FatherBuildCliOpts;
  constructor(opts: FatherBuildCliOpts) {
    this.opts = {
      configPath: opts.configPath,
      src: opts.src || resolve(process.cwd(), 'src', 'main'),
      output: opts.output || resolve(process.cwd(), TMP_DIR, 'main'),
    };
  }
  watch(opts: WatchOpts): { exit: () => void } {
    const proc = fork(
      join(require.resolve('father-build'), '../../bin/father-build.js'),
      [
        `--src=${this.opts.src}`,
        `--output=${this.opts.output}`,
        '-w',
        `--config=${this.opts.configPath}`,
      ],
      {
        stdio: 'pipe',
        env: { ...process.env, FORCE_COLOR: '1' },
        cwd: process.cwd(),
      },
    );
    proc.stdout?.pipe(process.stdout);
    proc.stderr?.pipe(process.stderr);
    const watchDir = join(process.cwd(), TMP_DIR, 'main');
    const watcher = chokidar.watch(watchDir, { ignoreInitial: true }).on(
      'all',
      debounce(() => {
        opts.onBuild?.();
      }, 500),
    );
    log.info(`watching ${watchDir}`);
    return {
      exit: () => {
        watcher.close().then(() => {
          proc.kill();
        });
      },
    };
  }
  build(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const args = this.opts.configPath
        ? [`--config=${this.opts.configPath}`]
        : [];
      const proc = fork(
        join(require.resolve('father-build'), '../../bin/father-build.js'),
        args.concat([
          `--output=${this.opts?.output}`,
          `--src=${this.opts.src}`,
        ]),
        {
          stdio: 'pipe',
          env: { ...process.env, FORCE_COLOR: '1' },
        },
      );
      proc.stdout?.pipe(process.stdout);
      proc.stderr?.pipe(process.stderr);
      const messages: unknown[] = [];
      proc.on('message', (msg) => {
        messages.push(msg);
      });
      proc.on('close', (code) => {
        if (code !== 0) {
          reject(messages.join('\n'));
        }
        resolve(true);
      });
      proc.on('error', (err) => {
        throw err;
      });
    });
  }
  static getUserConfig(): string | undefined {
    const userConfigPath = path.resolve(process.cwd(), '.fatherrc.js');
    if (existsSync(userConfigPath)) {
      return readFileSync(userConfigPath, 'utf-8');
    }
    return;
  }
}

export { FatherBuildCli };
