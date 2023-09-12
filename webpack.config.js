const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { Config, pretty } = require('./misc/console');
const packageJson = require('./package.json');
require('dotenv').config();

module.exports = function (env, args) {
  const mode = args.mode || 'production';
  const production = /^(production|prod|test)$/i.test(mode);
  const test = /^test$/i.test(mode);
  const development = !production;
  const publicPath = process.env.PUBLIC_PATH || '/';
  const title = process.env.MIEWER_TITLE || 'Miewer';
  console.log('Building', pretty('Miewer', Config.FgGreen, Config.Bright), ':');
  console.log('');
  console.log('Mode:       ', pretty(mode, Config.FgGreen));
  console.log('Title:      ', pretty(title, Config.FgGreen));
  console.log('Public path:', pretty(publicPath, Config.FgGreen));
  console.log('');
  return {
    mode: development ? 'development' : 'production',
    entry: {
      main: {
        import: path.resolve(__dirname, './src/index.tsx'),
        dependOn: 'miew',
      },
      jquery: 'jquery',
      miew: 'miew',
    },
    output: {
      publicPath: '/',
      path: path.resolve('./build'),
      filename: 'js/[name].[contenthash].js',
      clean: true,
      assetModuleFilename: 'static/[name].[ext][query]',
    },
    devtool: production ? 'source-map' : 'inline-source-map',
    devServer: {
      port: 3434,
      hot: true,
      open: true,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: ['ts-loader'],
        },
        {
          test: /\.scss$/i,
          sideEffects: true,
          use: [
            production ? MiniCssExtractPlugin.loader : 'style-loader',
            { loader: 'css-loader', options: { esModule: false } },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [['postcss-preset-env']],
                },
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.css$/,
          sideEffects: true,
          use: [
            production ? MiniCssExtractPlugin.loader : 'style-loader',
            { loader: 'css-loader', options: { esModule: false } },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [['postcss-preset-env']],
                },
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset/resource',
        },
      ],
    },
    target: ['web', 'es5'],
    optimization: {
      minimize: production,
      chunkIds: 'deterministic',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        template: path.resolve(__dirname, './src/index.html'),
        title,
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash].css',
      }),
      new webpack.DefinePlugin({
        PACKAGE_VERSION: JSON.stringify(packageJson.version),
        DEVELOPMENT: JSON.stringify(development),
        TEST: JSON.stringify(test),
        TITLE: JSON.stringify(title),
      }),
    ],
  };
};
