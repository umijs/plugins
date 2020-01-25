import { IApi } from 'umi';

// data come from https://caniuse.com/#search=intl
// you can find all browsers in https://github.com/browserslist/browserslist#browsers
const polyfillTargets = {
  ie: 10,
  firefox: 28,
  chrome: 23,
  safari: 9.1,
  opera: 12.1,
  ios: 9.3,
  ios_saf: 9.3,
  operamini: Infinity,
  op_mini: Infinity,
  android: 4.3,
  blackberry: Infinity,
  operamobile: 12.1,
  op_mob: 12.1,
  explorermobil: 10,
  ie_mob: 10,
  ucandroid: Infinity,
};

function isNeedPolyfill(targets = {}) {
  return (
    Object.keys(targets).find(key => {
      const lowKey = key.toLocaleLowerCase();
      return polyfillTargets[lowKey] && polyfillTargets[lowKey] >= targets[key];
    }) !== undefined
  );
}

export default ({ api }: { api: IApi }) => {
  api.addPolyfillImports(() => {
    return isNeedPolyfill(api.config.targets)
      ? [
          {
            source: require.resolve('intl'),
          },
        ]
      : [];
  });
};
