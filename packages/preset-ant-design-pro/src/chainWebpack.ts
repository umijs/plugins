const webpackPlugin = (config: any) => {
  // optimize chunks
  config.merge({
    optimization: {
      minimize: true,
      splitChunks: {
        chunks: 'all',
        minChunks: 2,
        automaticNameDelimiter: '.',
        cacheGroups: {
          vendor: {
            name: 'vendors',
            test({ resource }: { resource: string }) {
              return /[\\/]node_modules[\\/]/.test(resource);
            },
            priority: 10,
          },
        },
      },
    },
  });

  return config;
};

export default webpackPlugin;
