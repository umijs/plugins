import { join, relative } from 'path';
import { utils } from 'umi';
import { getModels } from './getModels';

const fixtures = join(__dirname, 'fixtures');

test('getModels', () => {
  const base = join(fixtures, 'normal');
  const models = getModels({
    base,
  });
  expect(models.map(m => relative(base, m))).toEqual([
    'b.js',
    'c.ts',
    'e.jsx',
    'f.tsx',
  ]);
});

test('getModels with opts.skipModelValidate', () => {
  const base = join(fixtures, 'skipModelValidate');
  const models = getModels({
    base,
    skipModelValidate: true,
  });
  expect(models.map(m => relative(base, m))).toEqual(['no_content.js']);
});

test('getModels with opts.extraModels', () => {
  const base = join(fixtures, 'extraModels');
  const models = getModels({
    base,
    extraModels: [
      join(base, '..', 'models-for-extraModels', 'a_valid.js'),
      join(base, '..', 'models-for-extraModels', 'b_invalid.js'),
    ],
  });
  expect(
    models.map(m => utils.winPath(relative(join(base, '..'), m))),
  ).toEqual(['models-for-extraModels/a_valid.js']);
});

test('getModels with opts.extraModels and opts.skipModelValidate', () => {
  const base = join(fixtures, 'extraModels');
  const models = getModels({
    base,
    extraModels: [
      join(base, '..', 'models-for-extraModels', 'a_valid.js'),
      join(base, '..', 'models-for-extraModels', 'b_invalid.js'),
    ],
    skipModelValidate: true,
  });
  expect(
    models.map(m => utils.winPath(relative(join(base, '..'), m))),
  ).toEqual([
    'models-for-extraModels/a_valid.js',
    'models-for-extraModels/b_invalid.js',
  ]);
});
