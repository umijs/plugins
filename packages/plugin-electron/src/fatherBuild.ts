import { existsSync, readFileSync } from 'fs';
import path, { resolve } from 'path';
import { TMP_DIR, TMP_DIR_PRODUCTION } from './constants';
// @ts-ignore
import build from 'father-build';
import fatherBuildArgs from './config/father';

export type Mode = 'development' | 'production';

export const getTmpDir = (mode: Mode) => {
  return mode === 'development' ? TMP_DIR : TMP_DIR_PRODUCTION;
};

type FatherBuildCliOpts = {
  configPath?: string;
  src?: string;
  output?: string;
  mode: Mode;
};

export type WatchReturnType = {
  exit: () => void;
};

type WatchOpts = {
  beforeBuild?: () => void;
  onBuildComplete?: () => void;
};
class FatherBuildCli {
  private opts: FatherBuildCliOpts;
  constructor(opts: FatherBuildCliOpts) {
    this.opts = {
      configPath: opts.configPath,
      src: opts.src || resolve(process.cwd(), 'src', 'main'),
      output:
        opts.output || resolve(process.cwd(), getTmpDir(opts.mode), 'main'),
      mode: opts.mode,
    };
  }
  private getBuildArgs = () => {
    console.log('get father build args,mode: ', this.opts.mode);
    return {
      ...fatherBuildArgs(this.opts.mode),
      silent: true,
      src: this.opts.src,
      output: this.opts.output,
    };
  };
  watch = async (opts: WatchOpts): Promise<{ exit: () => void }> => {
    const dispose = await build({
      watch: true,
      beforeBuild: opts.beforeBuild,
      onBuildComplete: opts.onBuildComplete,
      cwd: process.cwd(),
      buildArgs: this.getBuildArgs(),
    });
    return {
      exit: () => {
        dispose();
      },
    };
  };
  build = async () => {
    try {
      await build({
        cwd: process.cwd(),
        buildArgs: this.getBuildArgs(),
      });
    } catch (error) {
      console.log(error);
    }
  };
  static getUserConfig(): string | undefined {
    const userConfigPath = path.resolve(process.cwd(), '.fatherrc.js');
    if (existsSync(userConfigPath)) {
      return readFileSync(userConfigPath, 'utf-8');
    }
    return;
  }
}

export { FatherBuildCli };
