// fork https://github.com/sorrycc/test-build-result/blob/master/index.js to test all *.html
const assert = require('assert');
const { readdirSync, readFileSync, existsSync } = require('fs');
const { copy } = require('fs-extra');
const { join } = require('path');
const glob = require('glob');

function noop(content) {
  return content;
}

function assertBuildResult({ cwd, replaceContent = noop, testExists }) {
  const actualDir = join(cwd, 'dist');
  const expectDir = join(cwd, 'expected');

  if (existsSync(actualDir) && !existsSync(expectDir)) {
    copy(actualDir, expectDir);
    return;
  }

  const actualFiles = glob.sync('**/*.html', { cwd: actualDir });
  const expectFiles = glob.sync('**/*.html', { cwd: actualDir });

  expect(actualFiles.length).toEqual(expectFiles.length);

  actualFiles.forEach(file => {
    if (testExists) {
      expect(existsSync(join(expectDir, file))).toEqual(true);
    } else {
      const actualFile = readFileSync(join(actualDir, file), 'utf-8');
      const expectFile = readFileSync(join(expectDir, file), 'utf-8');
      expect(replaceContent(actualFile).trim()).toEqual(replaceContent(expectFile).trim());
    }
  });
}

function test({ root, build, replaceContent, testExists }) {
  assert(root && build, `Invalid arguments`);
  assert(existsSync(root), `root (${root}) not exists`);

  readdirSync(root)
    .filter(dir => dir.charAt(0) !== '.')
    .forEach(dir => {
      const fn = dir.endsWith('-only') ? it.only : it;
      fn(dir, done => {
        const cwd = join(root, dir);
        build({ cwd, dir })
          .then(() => {
            try {
              assertBuildResult({ cwd, replaceContent, testExists });
              done();
            } catch (e) {
              done(e);
            }
          })
          .catch(e => {
            done(e);
          });
      });
    });
}

module.exports = test;
