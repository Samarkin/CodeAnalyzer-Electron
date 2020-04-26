import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as webpack from 'webpack';
import * as CopyPlugin from 'copy-webpack-plugin';
import * as path from 'path';
// TODO: Investigate why custom .d.ts don't work
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const createElectronReloadWebpackPlugin = require('electron-reload-webpack-plugin');

const ElectronReloadWebpackPlugin = createElectronReloadWebpackPlugin({
  path:'./out',
  logLevel: 0,
});

const mainConfig: webpack.Configuration = {
  mode: 'production',
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
  ],
};

const rendererConfig: webpack.Configuration = {
  mode: 'production',
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
};

function applyDevSettings(config: webpack.Configuration): void {
  config.mode = 'development';
  config.devtool = 'source-map';
  config.plugins?.push(ElectronReloadWebpackPlugin());
  config.watch = true;
}

interface EnvVariables {
  mode?: string;
}

export default function (env: EnvVariables): Array<webpack.Configuration> {
  const isDevMode = env?.mode === 'dev';
  const isDist = env?.mode === 'dist';
  if (isDevMode) {
    applyDevSettings(mainConfig);
    applyDevSettings(rendererConfig);
  }
  if (isDist) {
    mainConfig.output = { ...mainConfig.output, path: __dirname + '/dist/tmp' };
    rendererConfig.output = { ...rendererConfig.output, path: __dirname + '/dist/tmp' };
  }
  mainConfig.plugins?.push(
    // Define dev mode to use in runtime
    new webpack.DefinePlugin({
      __DEVMODE__: JSON.stringify(isDevMode),
    }),
    // Copy package.json to the output folder
    new CopyPlugin([
      {
        from: __dirname + '/package.json',
        to: mainConfig.output?.path,
        transform(content: Buffer): Buffer {
          const pkg = JSON.parse(content.toString());
          // delete stuff not needed in runtime
          delete pkg.dependencies;
          delete pkg.devDependencies;
          delete pkg.scripts;
          pkg.main = path.basename(pkg.main);
          return Buffer.from(JSON.stringify(pkg));
        },
      },
    ]),
  );

  return [mainConfig, rendererConfig];
}