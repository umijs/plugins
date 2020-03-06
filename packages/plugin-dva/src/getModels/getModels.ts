import { utils } from 'umi';
import { readFileSync } from 'fs';
import { join } from 'path';
import { isValidModel } from './isValidModel';

export function getModels(opts: {
  base: string;
  pattern?: string;
  skipModelValidate?: boolean;
  extraModels?: string[];
}) {
  return utils.lodash
    .uniq(
      utils.glob
        .sync(opts.pattern || '**/*.{ts,tsx,js,jsx}', {
          cwd: opts.base,
        })
        .map(f => join(opts.base, f))
        .concat(opts.extraModels || [])
        .map(utils.winPath),
    )
    .filter(f => {
      if (/\.d.ts$/.test(f)) return false;
      if (/\.(test|e2e|spec).(j|t)sx?$/.test(f)) return false;

      // 允许通过配置下跳过 Model 校验
      if (opts.skipModelValidate) return true;

      // TODO: fs cache for performance
      return isValidModel({
        content: readFileSync(f, 'utf-8'),
      });
    });
}
