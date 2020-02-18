import pathToRegexp from 'path-to-regexp';

function isUrlMatch(define, url) {
  return pathToRegexp(define).exec(url);
}

export default (url, options = {}, mockData) => {
  console.log(`mock for url: ${url}`);
  const { params, method = 'get' } = options;
  mockData = mockData || window.g_block_mock;
  const keys = Object.keys(mockData);
  let mockInfo = keys.find(item => {
    let [aMethod, aUrl] = item.split(/\s+/);
    if (!aUrl) {
      aUrl = aMethod;
      aMethod = '*';
    }
    if (
      (aMethod === '*' ||
        aMethod.toLocaleLowerCase() === method.toLocaleLowerCase()) &&
      isUrlMatch(aUrl, url)
    ) {
      return true;
    }
    return false;
  });
  console.log(`find mock data key: ${mockInfo}`);
  if (mockInfo) {
    mockInfo = mockData[mockInfo];
    let retData;
    if (typeof mockInfo === 'function') {
      retData = mockInfo(
        {
          query: params,
          params: {} // TODO
        },
        {}
      );
    } else {
      retData = mockInfo;
    }
    return Promise.resolve(retData);
  } else {
    throw new Error('not find mock data');
  }
};
