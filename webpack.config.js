module.exports = [
  {
    mode: 'development',
    devtool: 'source-map',
    entry: './src/main.ts',
    target: 'electron-main',
    module: {
      rules: [{
        test: /\.ts$/,
        include: /src/,
        use: 'ts-loader'
      }]
    },
    resolve: {
      extensions: ['.js','.ts']
    },
    output: {
      path: __dirname + '/out',
      filename: 'main.js'
    }
  },
  {
    mode: 'development',
    devtool: 'source-map',
    entry: './src/renderer.ts',
    target: 'electron-renderer',
    module: {
      rules: [{
        test: /\.ts$/,
        include: /src/,
        use: 'ts-loader'
      }]
    },
    resolve: {
      extensions: ['.js','.ts']
    },
    output: {
      path: __dirname + '/out',
      filename: 'renderer.js'
    }
  }
];