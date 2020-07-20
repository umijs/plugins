import { join } from 'path';
import { Service } from 'umi';

const fixtures = join(__dirname, 'fixtures');

test('normal build', async () => {
  const cwd = join(fixtures, 'normal');
  const service = new Service({
    cwd,
  });
  let err;
  try {
    await service.run({
      name: 'build',
    });
    err = false;
  } catch (e) {
    err = true;
  }
  expect(err).toBeFalsy();
});

test('ssr build', async () => {
  const cwd = join(fixtures, 'ssr');
  const service = new Service({
    cwd,
  });
  let err;
  try {
    await service.run({
      name: 'build',
    });
    err = false;
  } catch (e) {
    err = true;
  }
  expect(err).toBeFalsy();
});
