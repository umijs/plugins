import chalk from 'chalk';
import fs, { existsSync, mkdirSync, writeFileSync } from 'fs';
import path, { join, resolve } from 'path';
import { spawnSync } from 'child_process';
import { EOL } from 'os';
import { TMP_DIR } from '../constants';

type LogFunctionType = (...args: string[]) => string;

export const log: {
  success: LogFunctionType;
  error: LogFunctionType;
  info: LogFunctionType;
  warn: LogFunctionType;
} = {
  success: (...args: string[]): string => {
    const msg = chalk.green('✔ success') + ' ' + args.join('');
    console.log(msg);
    return args.join('');
  },
  error: (...args: string[]): string => {
    const msg = chalk.red('✗ error') + ' ' + args.join('');
    console.log(msg);
    return args.join('');
  },
  info: (...args: string[]): string => {
    const msg = chalk.cyan('… info') + ' ' + args.join('');
    console.log(msg);
    return args.join('');
  },
  warn: (...args: string[]): string => {
    const msg = chalk.yellow('! warning') + ' ' + args.join('');
    console.log(msg);
    return args.join('');
  },
};

export const createVersionFile = (): {
  filename: string;
  fileContent: string;
} => {
  const commit = spawnSync('git', ['rev-parse', 'HEAD'], {
    encoding: 'utf-8',
  }).stdout.replace('\n', '');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { version } = require(path.resolve(process.cwd(), 'package.json'));
  const date = new Date().toUTCString();
  return {
    filename: 'version.json',
    fileContent: JSON.stringify({ commit, version, date }),
  };
};

export const buildVersion = (): void => {
  const { filename, fileContent } = createVersionFile();
  const outputPath = resolve(process.cwd(), TMP_DIR);
  if (!existsSync(outputPath)) {
    mkdirSync(outputPath, { recursive: true });
  }
  writeFileSync(resolve(outputPath, filename), fileContent, {
    encoding: 'utf-8',
  });
};

export const generateEntryFile = (fileContent: string): void => {
  const outputPath = join(process.cwd(), TMP_DIR);
  if (!existsSync(outputPath)) {
    mkdirSync(outputPath, { recursive: true });
  }
  writeFileSync(join(outputPath, 'entry.js'), fileContent);
};

export const generateMd5 = (files: string[]): string[] => {
  if (process.platform === 'darwin') {
    const { stdout } = spawnSync('md5', files, { encoding: 'utf-8' });
    const md5Filenames: string[] = [];
    stdout
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const [, filename, md5] =
          line.match(/MD5 \((.+)\) = ([a-z0-9]{32})/) || [];
        return [filename, md5];
      })
      .forEach((data) => {
        const [filename, md5] = data;
        const md5Filename = filename + '.md5';
        md5Filenames.push(md5Filename);
        try {
          fs.writeFileSync(md5Filename, md5.trim());
        } catch (err) {
          log.error((err as Error).stack || (err as Error).message);
        }
      });
    return md5Filenames;
  }
  if (process.platform === 'win32') {
    const md5Filenames: string[] = [];
    files.forEach((filepath) => {
      const { stdout } = spawnSync('certutil', ['-hashfile', filepath, 'MD5'], {
        encoding: 'utf-8',
      });
      const md5 = stdout.split(EOL)[1];
      const md5Filename = filepath + '.md5';
      fs.writeFileSync(md5Filename, md5.trim());
      md5Filenames.push(md5Filename);
    });
    return md5Filenames;
  }
  return [];
};

type GenEntryFunction = (mode: 'development' | 'production') => string;
export const getEntry: GenEntryFunction = (mode) => {
  if (mode === 'development') {
    return `module.exports = 'http://localhost:${process.env.PORT || '8000'}'`;
  } else {
    return `module.exports = \`file://\${require('path').resolve(__dirname,'./renderer/index.html')}\``;
  }
};
