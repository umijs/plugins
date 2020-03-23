interface FS {
  existsSync: (filePath: string) => boolean;
  readFileSync: (filePath: string) => string;
  readdirSync: (dirPath: string) => string;
}

const fs = jest.genMockFromModule<FS>('fs');

const PathToAccess = 'path/to/access';

function existsSync(filePath: string): boolean {
  if (filePath.startsWith(PathToAccess)) {
    return true;
  } else if (filePath.endsWith('path/to/js.js')) {
    return true;
  } else if (filePath.endsWith('path/to/no/export/access.ts')) {
    return true;
  }
  return false;
}

function readFileSync(filePath: string): string {
  if (filePath.startsWith(PathToAccess)) {
    return 'export default';
  }
  return 'Invalid content';
}

function readdirSync(dirPath: string): string {
  return 'test';
}

fs.existsSync = existsSync;
fs.readFileSync = readFileSync;
fs.readdirSync = readdirSync;

export default fs;
