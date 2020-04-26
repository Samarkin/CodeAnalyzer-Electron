import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as webpack from 'webpack';
// TODO: Investigate why custom .d.ts don't work
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const createElectronReloadWebpackPlugin = require('electron-reload-webpack-plugin');

const ElectronReloadWebpackPlugin = createElectronReloadWebpackPlugin({
  path:'./',
  logLevel: 0,
});

const configs: Array<webpack.Configuration> = [
  {
    mode: 'development',
    devtool: 'source-map',
    entry: './src/main/main.ts',
    target: 'electron-main',
    module: {
      rules: [{
        test: /\.ts$/,
        include: /src/,
        use: ['ts-loader','eslint-loader'],
      }],
    },
    resolve: {
      extensions: ['.js','.ts'],
    },
    output: {
      path: __dirname + '/out',
      filename: 'main.js',
    },
    plugins: [
      ElectronReloadWebpackPlugin(),
    ],
    watch: true,
  },
  {
    mode: 'development',
    devtool: 'source-map',
    entry: './src/renderer/renderer.tsx',
    target: 'electron-renderer',
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          include: /src/,
          use: ['ts-loader','eslint-loader'],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.js','.ts','.tsx'],
    },
    output: {
      path: __dirname + '/out',
      filename: 'renderer.js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/renderer/index.html',
      }),
      ElectronReloadWebpackPlugin(),
    ],
    watch: true,
  },
];

export default configs;