import { join } from 'path';
import { existsSync } from 'fs';
import { Service } from 'umi';
import { render, waitForDomChange, cleanup } from '@testing-library/react';

const fixtures = join(__dirname, '..', 'fixtures');

afterEach(() => {
  cleanup();
  delete process.env.__IS_SERVER;
});

test('normal', async () => {
  process.env.__IS_SERVER = true;
  const cwd = join(fixtures, 'normal');
  const service = new Service({
    cwd,
    plugins: [require.resolve('./')],
  });
  await service.run({
    name: 'g',
    args: {
      _: ['g', 'tmp'],
    },
  });

  const reactNode = require(join(cwd, 'src', '.umi-test', 'umi.ts')).default;
  const { container } = render(reactNode);

  expect(container.querySelector('h1').textContent).toEqual('Hello Helmet');
  await waitForDomChange();
  expect(document.title).toEqual('Title Helmet');
});

const htmlTemplate = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
    />
    <link rel="stylesheet" href="/umi.css" />
    <script>
      window.routerBase = "/";
    </script>
    <script>
      //! umi version: undefined
    </script>
  </head>
  <body>
    <div id="root"></div>

    <script src="/umi.js"></script>
  </body>
</html>`;

test('ssr', async () => {
  process.env.__IS_SERVER = true;
  const cwd = join(fixtures, 'ssr');
  const tmpServerFile = join(cwd, 'src', '.umi-test', 'core', 'server.ts');

  delete require.cache[tmpServerFile];
  const service = new Service({
    cwd,
    plugins: [require.resolve('./')],
  });
  await service.run({
    name: 'g',
    args: {
      _: ['g', 'tmp'],
    },
  });

  const { Helmet } = require(join(
    cwd,
    'src',
    '.umi-test',
    'core',
    'umiExports.ts',
  ));
  // must set false, because of jest env patch the document
  Helmet.canUseDOM = false;

  expect(existsSync(tmpServerFile)).toBeTruthy();
  const serverRender = require(tmpServerFile).default;
  const { html } = await serverRender({
    path: '/',
    htmlTemplate,
    mountElementId: 'root',
  });

  expect(html).toMatch(
    /<title data-react-helmet=\"true\">Title Helmet<\/title>/,
  );
  expect(html).toMatch(/<html lang=\"zh\" data-direction=\"top\">/);
});
