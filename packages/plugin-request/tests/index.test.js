/**
 * @jest-environment node
 */
import { join } from 'path';
import pluginFunc from '../src/index';

describe('plugin-request', () => {
  const getMockAPI = (writeTmpFile = () => {}, config) => {
    return {
      addRuntimePluginKey() {},
      onGenerateFiles(handler) {
        handler();
      },
      config: {
        request: config || {
          dataField: 'data',
        },
      },
      paths: {
        absTmpPath: join(__dirname, '.umi-test'),
      },
      describe: () => {},
      utils: {
        winPath(path) {
          return path;
        },
      },
      chainWebpack() {},
      addUmiExports() {},
      addDepInfo() {},
      writeTmpFile,
    };
  };

  test('dataField', () => {
    const writeTmpFile = jest.fn();
    pluginFunc(
      getMockAPI(writeTmpFile, {
        dataField: 'result',
      }),
    );

    expect(writeTmpFile).toHaveBeenNthCalledWith(1, {
      path: join('plugin-request', 'request.ts'),
      content: expect.stringContaining(
        `
import { ApplyPluginsType } from 'umi';
import { history, plugin } from '../core/umiExports';      
`.trim(),
      ),
    }); // 对于主文件，只检查一次，如果最后一个 replace 成功则认为全都成功

    expect(writeTmpFile).toHaveBeenNthCalledWith(2, {
      path: join('plugin-request', 'ui', 'index.ts'),
      content: expect.stringContaining('export { message, notification };'),
    });

    expect(writeTmpFile).toHaveBeenNthCalledWith(3, {
      path: join('plugin-request', 'ui', 'noop.ts'),
      content: expect.stringContaining('const noop = () => {};'),
    });
  });

  test('dataField format', () => {
    const writeTmpFile = jest.fn();
    pluginFunc(
      getMockAPI(writeTmpFile, {
        dataField: '',
      }),
    );
    expect(writeTmpFile).toHaveBeenCalled();

    expect(writeTmpFile).toHaveBeenNthCalledWith(1, {
      path: join('plugin-request', 'request.ts'),
      content: expect.stringContaining(
        `
import { ApplyPluginsType } from 'umi';
import { history, plugin } from '../core/umiExports';      
`.trim(),
      ),
    }); // 对于主文件，只检查一次，如果最后一个 replace 成功则认为全都成功

    expect(writeTmpFile).toHaveBeenNthCalledWith(2, {
      path: join('plugin-request', 'ui', 'index.ts'),
      content: expect.stringContaining('export { message, notification };'),
    });

    expect(writeTmpFile).toHaveBeenNthCalledWith(3, {
      path: join('plugin-request', 'ui', 'noop.ts'),
      content: expect.stringContaining('const noop = () => {};'),
    });

    try {
      pluginFunc(
        getMockAPI(undefined, {
          dataField: '&12',
        }),
      );
    } catch (e) {
      expect(e.message).not.toBeNull();
    }
  });
});
