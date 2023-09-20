const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const packageJson = require('./package.json');
require('dotenv').config();

function escapeRegExp(string) {
  const characters = ['-', '.', '/', '\\', '~'];
  let result = string;
  characters.forEach((character) => {
    result = result.replace(
      new RegExp('\\' + character, 'g'),
      `\\${character}`,
    );
  });
  return result;
}

/**
 * @param {string} groups
 * @returns {{[group: string]: {name: string, test: RegExp, chunks: string}}}
 */
function createCacheGroups(...groups) {
  return groups
    .map((group) => ({
      [group]: {
        name: group,
        test: new RegExp(`[/\\\\]node_modules[/\\\\](${escapeRegExp(group)})`),
        chunks: 'all',
      },
    }))
    .concat({
      vendors: {
        name: 'vendors',
        test: new RegExp(
          `[/\\\\]node_modules[/\\\\](?!${groups.map(escapeRegExp).join('|')})`,
        ),
        chunks: 'all',
      },
    })
    .reduce((r, c) => ({ ...r, ...c }), {});
}

module.exports = function (env, args) {
  const mode = args.mode || 'production';
  const production = /^(production|prod|test)$/i.test(mode);
  const test = /^test$/i.test(mode);
  const development = !production;
  const publicPath = process.env.PUBLIC_PATH || '/';
  const title = process.env.MIEWER_TITLE || 'Miewer';
  return {
    mode: development ? 'development' : 'production',
    entry: {
      miewer: path.resolve(__dirname, './src/index.tsx'),
    },
    output: {
      publicPath,
      path: path.resolve(args.profile ? './build-stats' : './build'),
      filename: 'js/[name].[contenthash].js',
      clean: !args.profile,
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
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: {
                  mode: 'icss',
                },
              },
            },
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
      runtimeChunk: {
        name: (entrypoint) => `${entrypoint.name}~runtime`,
      },
      splitChunks: {
        cacheGroups: createCacheGroups(
          'miew',
          'lodash',
          'react',
          'antd',
          '@antd',
          'three',
        ),
      },
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
