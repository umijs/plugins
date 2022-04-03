module.exports = function () {
  return {
    visitor: {
      CallExpression: {
        enter(path, state) {
          const { onCollect } = state.opts;
          const { node } = path;
          // require & import()
          if (
            (node.callee.type === 'Identifier' &&
              node.callee.name === 'require') ||
            node.callee.type === 'Import'
          ) {
            const dependencies = node.arguments
              .map(({ type, value }) => {
                if (type === 'StringLiteral') return value;
              })
              .filter(Boolean);
            if (dependencies[0]) {
              onCollect(state.filename, dependencies[0]);
            }
          }
        },
      },
      ImportDeclaration: {
        enter(path, state) {
          const { node } = path;
          const { onCollect } = state.opts;
          onCollect(state.filename, node.source.value);
        },
      },
    },
  };
};
