// ref:
// - https://umijs.org/plugin/develop.html
import { IApi } from 'umi';
import { join, dirname } from 'path';
import { readdirSync } from 'fs';
import upperCamelCase from 'uppercamelcase';

if (!process.env.PAGES_PATH) {
  process.env.PAGES_PATH = 'src';
}

interface SubBlock {
  name: string;
  path: string;
}

function findGitDir(thePath: string): string | null {
  if (thePath === '/') {
    return null;
  }
  const items = readdirSync(thePath);
  if (items.includes('.git')) {
    return thePath;
  } else {
    return findGitDir(dirname(thePath));
  }
}

export function getNameFromPkg(pkg: any) {
  if (!pkg.name) {
    return null;
  }
  return pkg.name.split('/').pop();
}

export default function(api: IApi) {
  api.registerCommand({
    name: 'block_dev',
    fn: ({ args }) => {
      const { _ } = args;
      process.env.APP_ROOT = `${_[0] || '.'}/`;
      process.env.UMI_UI = 'none';
      require(require.resolve(`umi/lib/forkedDev`));
    },
  });

  api.describe({
    config: {
      schema(joi) {
        return joi.object({
          layout: joi
            .string()
            .valid('ant-design-pro', 'ant-design-pro-user', 'blankLayout'),
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

  const { paths, logger } = api;

  const blockConfig = require(join(paths.cwd || '', 'package.json'))
    .blockConfig;
  const options = api.service.userConfig.blockDevtool || {};
  const layoutConfig = process.env.BLOCK_PAGES_LAYOUT || options.layout || "ant-design-pro";
  const pathToLayout =
    layoutConfig && join(__dirname, `../layouts/${layoutConfig}`);

  let subBlocks: SubBlock[] = [];

  // 支持区块依赖
  if (blockConfig && blockConfig.dependencies) {
    logger.debug('find dependencies in package.json');
    const gitRoot = findGitDir(api.paths.cwd || '');
    logger.debug(`get gitRoot: ${gitRoot}`);
    if (gitRoot) {
      subBlocks = blockConfig.dependencies.map((d: string) => {
        const subBlockPath = join(gitRoot, d);
        const subBlockConfig = require(join(subBlockPath, 'package.json'));
        const subBlockName = upperCamelCase(getNameFromPkg(subBlockConfig));
        return {
          name: subBlockName,
          path: subBlockPath,
        };
      });
    } else {
      throw new Error('Not find git root, can not use dependencies.');
    }
  }

  api.modifyDefaultConfig(memo => {
    // 这个环境变量是为了截图的时候可以动态设置 layout
    // 所以会优先从 环境变量里面取
    const path = process.env.BLOCK_DEV_PATH || options.path || '/';

    if (pathToLayout) {
      return {
        ...memo,
        routes: [
          {
            path: '/',
            component: pathToLayout,
            routes: [
              {
                path,
                ...options.menu,
                component: '../',
                exact: false,
              },
            ],
          },
        ],
      };
    }
    return {
      ...memo,
      routes: [
        {
          ...options.menu,
          path,
          component: '../',
          exact: false,
        },
      ],
    };
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

    if (pathToLayout) {
      webpackConfig.module
        .rule('js')
        .include.add(pathToLayout)
        .end();
    }
  });
}
