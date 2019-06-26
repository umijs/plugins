"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getStaticRoutePaths = void 0;

var path = _interopRequireWildcard(require("path"));

var fs = _interopRequireWildcard(require("fs"));

var mkdirp = _interopRequireWildcard(require("mkdirp"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// for test
const getStaticRoutePaths = (_, routes) => {
  return _.uniq(routes.reduce((memo, route) => {
    // filter dynamic Routing like /news/:id, etc.
    if (route.path && route.path.indexOf(':') === -1) {
      memo.push(route.path);

      if (route.routes) {
        memo = memo.concat(getStaticRoutePaths(_, route.routes));
      }
    }

    return memo;
  }, []));
};

exports.getStaticRoutePaths = getStaticRoutePaths;

const nodePolyfill = () => {
  global.window = {};
  global.self = window;
  global.document = window.document;
  global.navigator = window.navigator;
  global.localStorage = window.localStorage;
};

var _default = (api, opts) => {
  const paths = api.paths,
        debug = api.debug,
        config = api.config,
        findJS = api.findJS;

  const _ref = opts || {},
        _ref$exclude = _ref.exclude,
        exclude = _ref$exclude === void 0 ? [] : _ref$exclude;

  const absOutputPath = paths.absOutputPath;

  if (!config.ssr) {
    throw new Error('config must use { ssr: true } when using umi preRender plugin');
  } // onBuildSuccess hook


  api.onBuildSuccessAsync(
  /*#__PURE__*/
  _asyncToGenerator(function* () {
    const routes = api.routes,
          _ = api._; // mock window

    nodePolyfill(); // require serverRender function

    const umiServerFile = findJS(absOutputPath, 'umi.server');

    if (!umiServerFile) {
      throw new Error(`can't find umi.server.js file`);
    }

    const serverRender = require(umiServerFile);

    const routePaths = getStaticRoutePaths(_, routes); // exclude render paths

    const renderPaths = routePaths.filter(path => !exclude.includes(path));
    debug(`renderPaths: ${renderPaths.join(',')}`); // loop routes

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = renderPaths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        const url = _step.value;
        const ctx = {
          url,
          req: {
            url
          },
          request: {
            url
          }
        }; // throw umi.server.js error stack, not catch

        const ReactDOMServer = serverRender.ReactDOMServer;
        debug(`react-dom version: ${ReactDOMServer.version}`);

        const _ref3 = yield serverRender.default(ctx),
              htmlElement = _ref3.htmlElement;

        const ssrHtml = ReactDOMServer.renderToString(htmlElement); // write html file

        const outputRoutePath = path.join(absOutputPath, url);
        mkdirp.sync(outputRoutePath);
        fs.writeFileSync(path.join(outputRoutePath, 'index.html'), ssrHtml);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }));
};

exports.default = _default;