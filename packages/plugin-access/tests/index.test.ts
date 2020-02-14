import { IApi } from 'umi';
import registerAccessPlugin, { Options } from '../src/index';

jest.mock('fs');

let mockApi: IApi;

describe('PluginAccess', () => {
  beforeEach(() => {
    mockApi = {
      paths: {
        absTmpPath: '/workspace/project/src/page/.umi',
        absSrcPath: '/workspace/project/src',
      },
      logger: {
        warn: jest.fn(),
      },
      onGenerateFiles: (cb: () => void) => {
        cb();
      },
      writeTmpFile: jest.fn(),
      addRuntimePlugin: jest.fn(),
      addUmiExports: jest.fn(),
      addTmpGenerateWatcherPaths: jest.fn(),
      utils: {
        winPath: jest
          .fn()
          .mockImplementation((input: string) => input.replace(/\\/g, '/')),
      },
      onOptionChange: (cb: (opts: Options) => void) => {
        cb({ showWarning: true });
      },
    } as any;
  });

  it('should call log.warn when access file does not exist', () => {
    registerAccessPlugin(mockApi);
    expect(mockApi.logger.warn).toHaveBeenCalledTimes(1);
  });

  it('should call log.warn when access file exist but has not default exporting', () => {
    mockApi.paths.absSrcPath = 'path/to/no/export';
    registerAccessPlugin(mockApi);
    expect(mockApi.logger.warn).toHaveBeenCalledTimes(1);
  });

  it('should NOT call log.warn when access file does not exist but showWarning option is false', () => {
    registerAccessPlugin(mockApi, { showWarning: false });
    expect(mockApi.logger.warn).not.toHaveBeenCalled();
  });

  it('should run correctly when access file is defined and default exporting a function', () => {
    mockApi.paths.absSrcPath = 'path/to';
    registerAccessPlugin(mockApi, { showWarning: true });
    expect(mockApi.logger.warn).not.toHaveBeenCalled();
    expect(mockApi.writeTmpFile).toHaveBeenCalledTimes(4);
    expect(mockApi.addUmiExports).toHaveBeenCalledTimes(1);
    expect(mockApi.addTmpGenerateWatcherPaths).toHaveBeenCalledTimes(1);
    expect(mockApi.utils.winPath).toHaveBeenCalledTimes(1);
  });
});
