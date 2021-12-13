import electron from 'electron';
import proc, { ChildProcess } from 'child_process';
import { resolve } from 'path';
import yParser from 'yargs-parser';
import { log } from './utils';
const args = yParser(process.argv.slice(2));

const appPath = resolve(process.cwd());

export class ElectronProcessManager {
  electronProcess: ChildProcess | undefined;
  start() {
    this.kill();
    const childProc = proc.spawn(
      electron as unknown as string,
      args.inspect ? [`--inspect=${args.inspect}`, appPath] : [appPath],
      {
        stdio: 'pipe',
        env: {
          ...process.env,
          FORCE_COLOR: '1',
        },
      },
    );

    childProc.on('error', (err) => {
      log.error('electron process error!');
      console.log(err);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      childProc.kill();
      process.exit(1);
    });

    childProc.stdout?.pipe(process.stdout);
    childProc.stderr?.pipe(process.stderr);

    this.electronProcess = childProc;
  }

  kill() {
    this.electronProcess?.kill();
  }
}
