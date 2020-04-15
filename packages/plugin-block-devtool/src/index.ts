// ref:
// - https://umijs.org/plugin/develop.html
import { IApi } from 'umi';
import { join, dirname } from 'path';
import { readdirSync, copyFileSync, existsSync, mkdirSync, readdir } from 'fs';
import upperCamelCase from 'uppercamelcase';
import rimraf from 'rimraf';
import fs from '../../plugin-access/tests/__mocks__/fs';
interface SubBlock {
  name: string;
  path: string;
}

if (!process.env.PAGES_PATH) {
  process.env.PAGES_PATH = 'src';
}
function findGitDir(thePath: string): string | null {
  if (thePath === '/') {
    return null;
  }
  const items = readdirSync(thePath);
  if (items.includes('.git')) {
    return thePath;
  }
  return findGitDir(dirname(thePath));
}

function getNameFromPkg(pkg: { name: string }) {
  if (!pkg.name) {
    return null;
  }
  return pkg.name.split('/').pop();
}

module.exports = function(api: IApi) {
  const { paths, logger } = api;
  const cwd = paths.cwd || process.cwd();
  const blockPath = join(cwd, `${process.argv.slice(2)[1] || '.'}`);
  process.env.APP_ROOT = blockPath;

  api.describe({
    config: {
      schema(joi) {
        return joi.object({
          path: joi.string(),
          mockUmiRequest: joi.boolean(),
          menu: joi.object({
            name: joi.string(),
          }),
        });
      },
      default: {},
    },
  });

  const blockConfig = require(join(paths.cwd || '', 'package.json'))
    .blockConfig;
  const options = api.service.userConfig.blockDevtool || {};

  let subBlocks: SubBlock[] = [];

  // 支持区块依赖
  if (blockConfig && blockConfig.dependencies) {
    logger.debug('find dependencies in package.json');
    const gitRoot = findGitDir(api.paths.cwd || '');
    logger.debug(`get gitRoot: ${gitRoot}`);
    if (gitRoot) {
      subBlocks = blockConfig.dependencies.map((d: string) => {
        const subBlockPath = join(gitRoot, d);
        const subBlockConfig = require(join(subBlockPath, 'package.json')) as {
          name: string;
        };
        const subBlockName = upperCamelCase(
          getNameFromPkg(subBlockConfig) || '',
        );
        return {
          name: subBlockName,
          path: subBlockPath,
        };
      });
    } else {
      throw new Error('Not find git root, can not use dependencies.');
    }
  }

  api.onGenerateFiles(() => {
    api.writeTmpFile({
      path: 'block-devtool/layout.tsx',
      content: `
import React from 'react';
import { BasicLayout } from '@ant-design/pro-layout';

export default (props) => {
  const { children } = props;
  return (
    <BasicLayout {...props} pure>
      {children}
    </BasicLayout>
  );
};
    `,
    });
  });

  api.modifyConfig(memo => {
    // 这个环境变量是为了截图的时候可以动态设置 layout
    // 所以会优先从 环境变量里面取
    const path = process.env.BLOCK_DEV_PATH || options.path || '/';

    return {
      ...memo,
      routes: [
        {
          path: '/',
          component: '../.umi/block-devtool/layout',
          routes: [
            {
              ...options.menu,
              path,
              component: join('../', process.argv.slice(2)[1], './src/index'),
              exact: false,
            },
          ],
        },
      ],
    };
  });

  // link locales 和 models
  ['locales', 'models'].map(dirName => {
    if (existsSync(join(cwd, dirName))) {
      rimraf.sync(join(cwd, dirName));
    }
    mkdirSync(join(cwd, dirName));
  });

  const localesPath = join(blockPath, 'src', 'locales');

  if (existsSync(localesPath)) {
    // copy 每个文件
    readdirSync(localesPath).map(fileName => {
      const copyFilePath = join(blockPath, 'src', 'locales', fileName);
      if (existsSync(copyFilePath)) {
        copyFileSync(copyFilePath, join(cwd, 'locales', fileName));
      }
    });
  }

  // link models 文件
  ['model.ts', 'service.ts', 'data.d.ts'].map(fileName => {
    const copyFilePath = join(blockPath, 'src', fileName);
    if (existsSync(copyFilePath)) {
      copyFileSync(copyFilePath, join(cwd, 'models', fileName));
    }
  });

  api.addHTMLStyles(() => [
    {
      content: `
     body,html,#root{
       height:100%
     }
    `,
    },
  ]);

  api.chainWebpack(webpackConfig => {
    subBlocks.forEach(b => {
      webpackConfig.resolve.alias.set(`./${b.name}`, join(b.path, 'src'));
    });

    return webpackConfig;
  });
};
