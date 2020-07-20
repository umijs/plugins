import { join } from 'path';
import { Service } from 'umi';

const fixtures = join(__dirname, 'fixtures');

test('normal build', async () => {
  const cwd = join(fixtures, 'normal');
  const service = new Service({
    cwd,
    plugins: [require.resolve('./index.ts')],
  });
  let err;
  try {
    await service.run({
      name: 'build',
    });
    err = false;
  } catch (e) {
    console.error('normal build error', e);
    err = true;
  }
  expect(err).toBeFalsy();
});

test('ssr build', async () => {
  const cwd = join(fixtures, 'ssr');
  const service = new Service({
    cwd,
    plugins: [require.resolve('./index.ts')],
  });
  let err;
  try {
    await service.run({
      name: 'build',
    });
    err = false;
  } catch (e) {
    console.error('ssr build error', e);
    err = true;
  }
  expect(err).toBeFalsy();
});
