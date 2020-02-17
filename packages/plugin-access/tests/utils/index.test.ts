import { getScriptPath, checkIfHasDefaultExporting } from '../../src/utils';

jest.mock('fs');

describe('Utils', () => {
  describe('getScriptPath', () => {
    it('should return script file path when file exist', () => {
      const tsScriptPath = getScriptPath('path/to/access');
      const jsScriptPath = getScriptPath('path/to/js');
      expect(tsScriptPath).toBe('path/to/access.ts');
      expect(jsScriptPath).toBe('path/to/js.js');
    });

    it('should return empty path when file does not exist', () => {
      const scriptPath = getScriptPath('path/not/exist');
      expect(scriptPath).toBe('');
    });
  });

  describe('checkIfHasDefaultExporting', () => {
    it('should return true if file path has default exporting member', () => {
      const hasDefaultExporting: boolean = checkIfHasDefaultExporting(
        'path/to/access',
      );
      expect(hasDefaultExporting).toBe(true);
    });

    it('should return false if file path does not has default exporting member', () => {
      const hasDefaultExporting: boolean = checkIfHasDefaultExporting(
        'path/not/exist',
      );
      expect(hasDefaultExporting).toBe(false);
    });
  });
});
