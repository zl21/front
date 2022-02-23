/* eslint-disable */
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const copyWebpackPlugin = require('copy-webpack-plugin')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.js')
// 打包给模板项目测试用
const config = {
  entry: {
    index: './build/index.publish.js',
  },
  output: {
    filename: 'r3.min.js',
    path: path.join(__dirname, '../r3.publish'),
    globalObject: 'this',
    library: 'R3',
    libraryTarget: 'umd',
    libraryExport: 'default',
    umdNamedDefine: true,
    publicPath: './',
  },
  externals: {
    vue: {
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue',
      root: 'Vue',
    },
    vuex: {
      commonjs: 'vuex',
      commonjs2: 'vuex',
      amd: 'vuex',
      root: 'Vuex',
    },
    'vue-router': {
      commonjs: 'vue-router',
      commonjs2: 'vue-router',
      amd: 'vue-router',
      root: 'VueRouter',
    },
    axios: {
      commonjs: 'axios',
      commonjs2: 'axios',
      amd: 'axios',
      root: 'axios',
    },
    'ark-ui': {
      commonjs: 'ark-ui',
      commonjs2: 'ark-ui',
      amd: 'ark-ui',
      root: 'Ark',
    },
    ztree: {
      commonjs: 'ztree',
      commonjs2: 'ztree',
      amd: 'ztree',
      root: 'ztree',
    },
    jquery: {
      commonjs: 'jquery',
      commonjs2: 'jquery',
      amd: 'jquery',
      root: '$',
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
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
            loader: MiniCssExtractPlugin.loader,
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
      filename: 'r3.min.css',
    }),
    new CleanWebpackPlugin(['r3.publish']),
    new copyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../src/assets'),
        to: path.resolve(__dirname, '../r3.publish/src/assets'),
      },
      {
        from: path.resolve(__dirname, '../src/index.less'),
        to: path.resolve(__dirname, '../r3.publish/src'),
      },
    ]),
  ],
  mode: 'development',
}

module.exports = merge(baseConfig, config)
