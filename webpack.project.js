const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const projectConfig = require('./project.config');

const target = projectConfig.target; // 框架研发网关开启环境
const proxyLists = ['/p/c', '/ad-app', '/jflow'];
const proxyListsForGateway = ['/ad-app/p/c'];


const indexProHtml = path.posix.join('/', 'index.project.html');
const indexHtml = path.posix.join('/', 'index.project.html');

module.exports = env => ({
  entry: {
    index: './index.project.js',
  },
  externals: {
    vue: 'Vue',
    vuex: 'Vuex',
    'vue-router': 'VueRouter',
    axios: 'axios',
    // 'ag-grid': 'agGrid',
    'ark-ui': 'Ark',
    // jquery: '$',
    R3: '@syman/burgeon-r3',
    jflowPlugin: '@syman/jflow-plugin',
    ztree: 'ztree',
  },
  devServer: {
    compress: true,
    port: 8190,
    host: '0.0.0.0',
    open: true,
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: env && env.production ? indexProHtml : indexHtml },
      ],
    },
    publicPath: '/',
    proxy: [
     
      {
        context: proxyLists,
        target,
        changeOrigin: true
      }, {
        context: proxyListsForGateway,
        target,
        changeOrigin: true
      },
    ]
  },
  target: 'web',
  devtool: 'eval-cheap-module-source-map',
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: path.join(__dirname, './dist'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
          },
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        },
      },
      {
        test: /\.(sa|sc|c|le)ss$/,
        use: [{
          loader: env && env.production ? MiniCssExtractPlugin.loader : 'style-loader',
        }, {
          loader: 'css-loader',
        }, {
          loader: 'less-loader',
          options: { javascriptEnabled: true }
        }],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: '[path][name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              context: 'src',
            },
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
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      chunksSortMode: 'none',
      title: env && env.production ? projectConfig.projectsTitle : `Debug:${projectConfig.projectsTitle}`,
      template: env && env.production ? './index.pro.html' : './index.html',
      inject: true,
      favicon: projectConfig.projectIconPath,
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, './static'),
        to: 'static',
        ignore: ['.*'],
      },
    ]),
    // new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery',
    //   jquery: 'jquery',
    //   'window.jQuery': 'jquery'
    // })
  ],
  mode: env && env.production ? 'production' : 'development',
  resolve: {
    extensions: ['.js', '.json', '.vue', '.css'],
  },
  optimization: {
    minimizer: [new TerserJSPlugin({
      parallel: true,
      sourceMap: true,
      terserOptions: {
        compress: {
          pure_funcs: ['console.log']
        }
      }
    }), new OptimizeCSSAssetsPlugin({})],
    splitChunks: {
      chunks: 'all',
    }
  },
});
