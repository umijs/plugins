import { resolve } from 'path';
import chalk from 'chalk';
import yParser from 'yargs-parser';
import { TMP_DIR } from './constants';
const args = yParser(process.argv.slice(2));

const checkMainField = () => {
  const userPackageJson = require(resolve(process.cwd(), './package.json'));
  const { main } = userPackageJson;
  if (!main) {
    console.log(
      chalk.bgRedBright('Error') +
        ` ${chalk.red('main')} field in package.json must not be empty`,
    );
    throw new Error('empty entry');
  } else {
    if (!args.output && main !== `${TMP_DIR}/main/index.js`) {
      console.log(
        chalk.bgRedBright('Error') +
          ` ${chalk.red('main')} field in package.json must be ${chalk.red(
            `"${TMP_DIR}/main/index.js"`,
          )}`,
      );
      throw new Error('wrong entry');
    }
  }
};

export const check = () => {
  checkMainField();
};
