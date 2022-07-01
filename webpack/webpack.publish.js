/* eslint-disable */
const path = require('path');
// const { VueLoaderPlugin } = require('vue-loader');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const { ESBuildMinifyPlugin } = require('esbuild-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.js')

const config = {
  entry: {
    index: './build/index.publish.js'
  },
  output: {
    filename: 'r3.min.js',
    path: path.join(__dirname, '../r3.publish'),
    globalObject: 'this',
    library: 'R3',
    libraryTarget: 'umd',
    libraryExport: 'default',
    umdNamedDefine: true,
    publicPath: './'
  },
  devtool: 'source-map',
  // devtool: 'eval-cheap-module-source-map',
  externals: {
    vue: {
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue',
      root: 'Vue'
    },
    vuex: {
      commonjs: 'vuex',
      commonjs2: 'vuex',
      amd: 'vuex',
      root: 'Vuex'
    },
    'vue-router': {
      commonjs: 'vue-router',
      commonjs2: 'vue-router',
      amd: 'vue-router',
      root: 'VueRouter'
    },
    axios: {
      commonjs: 'axios',
      commonjs2: 'axios',
      amd: 'axios',
      root: 'axios'
    },
    'ark-ui': {
      commonjs: 'ark-ui',
      commonjs2: 'ark-ui',
      amd: 'ark-ui',
      root: 'Ark'
    },
    ztree: {
      commonjs: 'ztree',
      commonjs2: 'ztree',
      amd: 'ztree',
      root: 'ztree'
    },
    jquery: {
      commonjs: 'jquery',
      commonjs2: 'jquery',
      amd: 'jquery',
      root: '$'
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{
          loader: 'style-loader',
        }, {
          loader: 'css-loader',
        }],
      },
      {
        test: /\.(sa|sc|le)ss$/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
        }, {
          loader: 'css-loader',
        }, {
          loader: 'less-loader',
          options: {
            javascriptEnabled: true
          }
        }],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'r3.min.css',
    }),
    new CleanWebpackPlugin(['r3.publish']),
    new copyWebpackPlugin([{
        from: path.resolve(__dirname, "../src/assets"),
        to: path.resolve(__dirname, "../r3.publish/src/assets")
      },
      {
        from: path.resolve(__dirname, "../src/index.less"),
        to: path.resolve(__dirname, "../r3.publish/src")
      },
    ]),
  ],
  mode: 'production',
  optimization: {
    minimizer: [
      new TerserJSPlugin({
      parallel: true,
      sourceMap: true,
      terserOptions: {
        compress: {
          pure_funcs: ['console.log']
        }
      }
    })
    // new ESBuildMinifyPlugin({
    //   drop: ['console','debugger'],
    //   css: true // 压缩css
    // })
  ],
  },
}
module.exports = merge(baseConfig, config);