const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const projectConfig = require('./project.config');

const target = projectConfig.target; // 框架研发网关开启环境
const proxyLists = ['/p/c'];
const proxyListsForGateway = ['/ad-app/p/c', '/asynctask/p/cs'];
const proxyListsForIShop = ['/ishopad-app', '/ishopplatform/p/c', '/ishopbill/p/c', '/ishopbase/p/c'];
const proxyListsForPalmCloud = ['/mboscloud-app'];
const proxyListsForPalmZx = ['/zhixiao-app'];
const proxyListForShangFei = ['/user-center', '/shangfei'];
const proxyListForWuliu = ['/wuliu-admin'];


const indexProHtml = path.posix.join('/', 'index.pro.html');
const indexHtml = path.posix.join('/', 'index.html');

module.exports = env => ({
  entry: {
    index: './index.js',
  },
  externals: {
    vue: 'Vue',
    vuex: 'Vuex',
    'vue-router': 'VueRouter',
    axios: 'axios',
    // 'ag-grid': 'agGrid',
    'burgeon-ui': 'Ark'
  },
  devServer: {
    compress: true,
    port: 8088,
    host: '192.168.8.172',
    open: true,
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: env && env.production ? indexProHtml : indexHtml },
      ],
    },
    publicPath: '/',
    proxy: [
      {
        context: proxyListsForIShop,
        target,
        changeOrigin: true
      },
      {
        context: proxyListForShangFei,
        target,
        changeOrigin: true
      },
      {
        context: proxyListForWuliu,
        target,
        changeOrigin: true
      },
      
      {
        context: proxyLists,
        target,
        changeOrigin: true
      }, {
        context: proxyListsForGateway,
        target,
        changeOrigin: true
      }, {
        context: proxyListsForPalmCloud,
        target,
        changeOrigin: true
      }, {
        context: proxyListsForPalmZx,
        target,
        changeOrigin: true
      },
      {
        context: '/api',
        // target: 'http://47.99.229.124:9093' // 打印
        target: 'http://106.15.24.156:19999', // 打印李宁环境
        changeOrigin: true
      },
      {
        context: '/jflow',
        // target: 'http://106.15.24.156:32940', // 重新占单
        // target: 'http://106.15.24.156:32940', // 李宁环境
        target: 'http://jflow-shangfei.dev.burgeononline.com/', // 商飞环境
        // target: ' http://47.102.164.111:26665/', // 卡宾环境

       
        // target: ' http://zhixiao-jflow.pro.burgeononline.com/', // 知晓环境

                
        // target: 'http://jflow-qiaodan.dev.burgeononline.com', // 乔丹测试环境
        changeOrigin: true
      }]
  },
  target: 'web',
  devtool: env && env.production ? 'source-map' : 'cheap-module-eval-source-map',
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
  ],
  mode: env && env.production ? 'production' : 'development',
  resolve: {
    extensions: ['.js', '.json', '.vue', '.css'],
  },
  optimization: {
    minimizer: [new TerserJSPlugin({
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
