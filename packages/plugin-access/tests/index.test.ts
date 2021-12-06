import { IApi } from 'umi';
import registerAccessPlugin from '../src/index';

jest.mock('fs');

let mockApi: IApi;

describe('PluginAccess', () => {
  beforeEach(() => {
    mockApi = {
      describe: () => {},
      ConfigChangeType: {
        regenerateTmpFiles: 'regenerateTmpFiles',
      },
      EnableBy: {
        config: 'config',
      },
      paths: {
        absTmpPath: '/workspace/project/src/page/.umi',
        absSrcPath: '/workspace/project/src',
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
    } as any;
  });

  it('should run correctly when access file is defined and default exporting a function', () => {
    mockApi.paths.absSrcPath = 'path/to';
    registerAccessPlugin(mockApi);
    expect(mockApi.writeTmpFile).toHaveBeenCalledTimes(5);
    expect(mockApi.addUmiExports).toHaveBeenCalledTimes(1);
    expect(mockApi.addTmpGenerateWatcherPaths).toHaveBeenCalledTimes(1);
  });

  it('should not writeTmpFile and not addRuntimePlugin if there is no access file', () => {
    mockApi.utils.winPath = jest.fn(() => 'not/exist/path');
    registerAccessPlugin(mockApi);
    expect(mockApi.writeTmpFile).not.toBeCalled();
    expect(mockApi.addRuntimePlugin).not.toBeCalled();
  });
});
