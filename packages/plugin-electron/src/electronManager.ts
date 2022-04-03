import electron from 'electron';
import proc, { ChildProcess } from 'child_process';
import yParser from 'yargs-parser';
import { log } from './utils';
const args = yParser(process.argv.slice(2));

export class ElectronProcessManager {
  electronProcess: ChildProcess | undefined;
  private cwd: string;
  constructor(cwd: string | undefined = process.cwd()) {
    this.cwd = cwd;
  }
  start() {
    this.kill();
    const childProc = proc.spawn(
      electron as unknown as string,
      args.inspect ? [`--inspect=${args.inspect}`, this.cwd] : [this.cwd],
      {
        stdio: 'pipe',
        env: {
          ...process.env,
          FORCE_COLOR: '1',
        },
        cwd: this.cwd,
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
