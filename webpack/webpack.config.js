const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { ModuleFederationPlugin } = require('webpack').container
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.js')

const projectConfig = require('../projectConfig/project.config')

const config = (env) => ({
  entry: {
    index: './index.js',
  },
  experiments: {
    topLevelAwait: true,
  },
  target: 'web',
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: path.join(__dirname, '../dist'),
    publicPath: '/',
  },
  module: {
    exprContextCritical: false,
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
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
            loader: 'style-loader',
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
      title:
        env && env.production
          ? projectConfig.projectsTitle
          : `Debug:${projectConfig.projectsTitle}`,
      template: './index.html',
      templateParameters: (compilation, assets, assetTags, options) => {
        if (
          process.env.BUILD_ENV === 'oss_no' ||
          process.env.BUILD_ENV === 'oss'
        ) {
          // 兼容oss 配置
          return {
            Version: '1.4',
            enableGateWay: process.env.BUILD_ENV === 'oss_no' ? false : true,
            enableLoginPro: false,
          }
        }
        return {
          Version: process.env.BUILD_ENV || '1.4',
          enableGateWay: process.env.BUILD_ENV == '1.4',
          enableLoginPro: process.env.BUILD_ENV == '1.4',
        }
      },
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
      },
      shared: ['vue', 'vuex', 'vue-router', '@syman/ark-ui', 'axios'],
    }),
  ],
  mode: 'development',
})
module.exports = merge(baseConfig, config())
