import { join } from 'path';
import pluginFunc from './index';

const examplePath = join(__dirname, '../example');

describe('plugin-request', () => {
  const getMockAPI = (writeTmpFile = () => {}) => {
    return {
      addRuntimePluginKey() {},
      onGenerateFiles(handler) {
        handler();
      },
      addRuntimePlugin() {},
      register() {},
      paths: {
        absTmpDirPath: '/test/page/.umi',
        absSrcPath: examplePath,
        cwd: examplePath,
      },
      findJS: p => `${p}.ts`,
      winPath() {
        return '/winpathtest';
      },
      addUmiExports() {},
      writeTmpFile,
    };
  };

  test('normal', () => {
    const writeTmpFile = jest.fn();
    pluginFunc(getMockAPI(writeTmpFile));

    expect(writeTmpFile).toHaveBeenCalledTimes(3);
  });
});
