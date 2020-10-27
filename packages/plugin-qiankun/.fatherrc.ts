export default {
  runtimeHelpers: true,
  disableTypeCheck: false,
  browserFiles: [
    'src/master/runtimePlugin.ts',
    'src/slave/lifecycles.ts',
    'src/slave/runtimePlugin.ts',
    'src/common.ts',
  ],
};
