const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { ModuleFederationPlugin } = require('webpack').container
const { merge } = require('webpack-merge')

const baseConfig = require('./webpack.base.js')
const projectConfig = require('../projectConfig/project.config')

const config = (env) => ({
  entry: {
    index: './index.js',
  },
  target: 'web',
  devtool: env && env.production ? 'source-map' : false,
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: path.join(__dirname, '../entry'),
  },
  module: {
    exprContextCritical: false,
    rules: [
      {
        test: /\.css$/,
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
        ],
      },
      {
        test: /\.(sa|sc|le)ss$/,
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
    new CleanWebpackPlugin([env && env.production ? 'entry' : 'entry']),
    new HtmlWebpackPlugin({
      chunksSortMode: 'none',
      title:
        env && env.production
          ? projectConfig.projectsTitle
          : `Debug:${projectConfig.projectsTitle}`,
      template: './index.html',
      inject: true,
      favicon: projectConfig.projectIconPath,
    }),
    new ModuleFederationPlugin({
      filename: 'remoteEntry.js',
      // 唯一ID，用于标记当前服务
      name: 'syman_burgeon_r3',
      library: {
        type: 'var',
        name: 'syman_burgeon_r3',
      },
      // 需要暴露的模块，使用时通过 `${name}/${expose}` 引入
      exposes: {
        './ApiPermission':
          './src/__customize__/ApiPermissionWings/ApiPermission.vue',
        index: './share/index.share.js',
        login: './share/commponts/login/index.js',
      },
      shared: ['vue', 'vuex', 'vue-router', '@syman/ark-ui', 'axios'],
    }),
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
            warnings: false,
          },
        },
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
    splitChunks: {
      chunks: 'all',
    },
  },
})

module.exports = merge(baseConfig, config())