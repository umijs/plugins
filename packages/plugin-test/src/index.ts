import { IApi, utils } from 'umi';

export default (api: IApi) => {
  api.registerCommand({
    name: 'test',
    description: 'test with jest',
    details: `
$ umi-test

# watch mode
$ umi-test -w
$ umi-test --watch

# collect coverage
$ umi-test --coverage

# print debug info
$ umi-test --debug

# test specified package for lerna package
$ umi-test --package name

# don't do e2e test
$ umi-test --no-e2e
    `,
    async fn() {
      const args = utils.yParser(process.argv.slice(3), {
        alias: {
          watch: ['w'],
          version: ['v'],
        },
        boolean: ['coverage', 'watch', 'version', 'debug', 'e2e'],
        default: {
          e2e: true,
        },
      });

      require('@umijs/test')
        .default(args)
        .catch((e: Error) => {
          console.error(utils.chalk.red(e));
          process.exit(1);
        });
    },
  });
};
