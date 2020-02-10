import pluginFunc from '../src/index';

describe('plugin-request', () => {
  const getMockAPI = (writeTmpFile = () => {}) => {
    return {
      addRuntimePluginKey() {},
      onGenerateFiles(handler) {
        handler();
      },
      paths: {
        absTmpPath: '/test/page/.umi',
      },
      utils: {
        winPath() {
          return '/winpathtest';
        },
      },
      addUmiExports() {},
      writeTmpFile,
    };
  };

  test('dataField', () => {
    const writeTmpFile = jest.fn();
    pluginFunc(getMockAPI(writeTmpFile), {
      dataField: 'result',
    });

    expect(writeTmpFile).toHaveBeenLastCalledWith({
      path: 'plugin-request/request.ts',
      content: expect.stringContaining('result => result?.result'),
    });

    expect(writeTmpFile).toHaveBeenLastCalledWith({
      path: 'plugin-request/request.ts',
      content: expect.stringContaining("['result']"),
    });

    expect(writeTmpFile).toHaveBeenLastCalledWith({
      path: 'plugin-request/request.ts',
      content: expect.stringContaining('result: T;'),
    });

    expect(writeTmpFile).toHaveBeenLastCalledWith({
      path: 'plugin-request/request.ts',
      content: expect.stringContaining('/winpathtest'),
    });
  });

  test('dataField format', () => {
    const writeTmpFile = jest.fn();
    pluginFunc(getMockAPI(writeTmpFile), {
      dataField: '',
    });
    expect(writeTmpFile).toHaveBeenCalled();

    expect(writeTmpFile).toHaveBeenLastCalledWith({
      path: 'plugin-request/request.ts',
      content: expect.stringContaining(
        'type ResultWithData<T = any> = {  [key: string]: any };',
      ),
    });

    expect(writeTmpFile).toHaveBeenLastCalledWith({
      path: 'plugin-request/request.ts',
      content: expect.stringContaining('BaseOptions<R, P>'),
    });

    expect(writeTmpFile).toHaveBeenLastCalledWith({
      path: 'plugin-request/request.ts',
      content: expect.stringContaining('BaseResult<R, P>'),
    });

    expect(writeTmpFile).toHaveBeenLastCalledWith({
      path: 'plugin-request/request.ts',
      content: expect.stringContaining('result => result'),
    });

    try {
      pluginFunc(getMockAPI(), {
        dataField: '&12',
      });
    } catch (e) {
      expect(e.message).not.toBeNull();
    }
  });
});
