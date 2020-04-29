/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import React from 'react';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { utils } from 'umi';
// import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import { getTmpFile } from '../src/utils/getTmpFile';
import { getModels } from '../src/utils/getModels';

const { winPath } = utils;

const fixtures = join(winPath(__dirname), 'fixtures');

const delay = (ms: number) =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

const extraModelConfig = {
  extraModel: [
    {
      absPath: join(fixtures, 'extraModel/extra/initialState.js'),
      namespace: '@@initialState',
    },
  ],
};

readdirSync(fixtures)
  .filter(file => file.charAt(0) !== '.')
  .forEach(file => {
    const fixture = join(fixtures, file);
    const tmpDir = join(fixture, '.umi');
    const extraModel = extraModelConfig[file];
    const modulesDir = join(fixture, 'models');
    const pagesDir = join(fixture, 'pages');
    const files = [
      ...getModels(modulesDir),
      ...getModels(pagesDir, `**/models/**/*.{ts,tsx,js,jsx}`),
      ...getModels(pagesDir, `**/*.model.{ts,tsx,js,jsx}`),
    ];
    const { providerContent, useModelContent } = getTmpFile(files, extraModel, [
      modulesDir,
      pagesDir,
    ]);
    const providerPath = join(tmpDir, 'Provider.tsx');
    if (!existsSync(tmpDir)) {
      mkdirSync(tmpDir);
    }
    writeFileSync(providerPath, providerContent, 'utf-8');
    writeFileSync(join(tmpDir, 'useModel.tsx'), useModelContent, 'utf-8');

    test(file, async () => {
      const Provider = require(providerPath).default;
      const App = require(join(fixture, 'index.tsx')).default;
      const context = {
        updateCount: 0,
      };
      const renderRet = render(
        <Provider>
          <App
            onUpdate={() => {
              context.updateCount += 1;
            }}
          />
        </Provider>,
      );
      await require(join(fixture, 'test.js')).default({
        ...renderRet,
        fireEvent,
        delay,
        context,
      });
    });
  });
