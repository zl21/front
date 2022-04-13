const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { merge } = require('webpack-merge')

const baseConfig = require('./webpack.base.js')
let projectConfig = require(`../projectConfig/project.config.${process.env
  .Version || '1.4'}`)

const config = (env) => ({
  entry: {
    index: './build/index.project.js',
  },
  externals: {
    R3: '@syman/burgeon-r3',
    jflowPlugin: '@syman/jflow-plugin',
  },
  target: 'web',
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: path.join(__dirname, '../dist'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c|le)ss$/,
        use: [
          {
            loader:
              env && env.production
                ? MiniCssExtractPlugin.loader
                : 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
            options: { javascriptEnabled: true },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'r3.css',
    }),
    new CleanWebpackPlugin([env && env.production ? 'dist' : 'devDist']),
    new HtmlWebpackPlugin({
      chunksSortMode: 'none',
      templateParameters: (compilation, assets, assetTags, options) => {
        return {
          Version: process.env.Version || '1.4',
          enableGateWay: process.env.Version == '1.4',
          enableLoginPro: process.env.Version == '1.4',
        }
      },
      title:
        env && env.production
          ? projectConfig.projectsTitle
          : `Debug:${projectConfig.projectsTitle}`,
      template: './index.html',
      inject: true,
      favicon: projectConfig.projectIconPath,
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: 'static',
        ignore: ['.*'],
      },
    ]),
  ],
  mode: env && env.production ? 'production' : 'development',
  optimization: {
    minimizer: [
      new TerserJSPlugin({
        parallel: true,
        sourceMap: true,
        terserOptions: {
          compress: {
            pure_funcs: ['console.log'],
          },
        },
      }),
    ],
    splitChunks: {
      chunks: 'all',
    },
  },
})

module.exports = merge(baseConfig, config())
