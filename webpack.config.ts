import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as webpack from 'webpack';

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
    ],
  },
];

export default configs;