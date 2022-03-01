const path = require('path');
// const { VueLoaderPlugin } = require('vue-loader');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

const projectConfig = require('./projectConfig/project.config');

const target = projectConfig.target; // 框架研发网关开启环境
const proxyLists = ['/p/c','/r3-cp','/r3-oc-oms', '/p/cs','/frr-center', '/eplan-center', '/ad-app', '/r3/qiaochu', '/retailcloud-crm2', '/retailcloud-official', '/ishop-synchronize', '/asynctask'];
const proxyListsForGateway = ['/ad-app/p/c', '/asynctask/p/cs'];
const proxyListsForIShop = ['/ishopad-app', '/ishopplatform/p/c', '/ishopbill/p/c', '/ishopbase/p/c', '/ishopcrm/p/cs/'];
const proxyListsForPalmCloud = ['/mboscloud-app'];
const proxyListsForPalmZx = ['/zhixiao-app'];
const proxyListForShangFei = ['/user-center', '/shangfei', '/tr-center'];
const proxyListForWuliu = ['/wuliu-admin'];
const proxyListForKABIN = ['/r3/cabben/pt'];
const proxyListForOMS = ['/p/c', '/p/cs', '/api', '/ad-app', '/r3-ps', '/r3-cp', '/r3-st', '/r3-oc-oms', '/r3-vip', '/r3-ipcs', '/asynctask/p/c', '/r3-pm', '/r3-ac', '/r3-sg']

const indexProHtml = path.posix.join('/', 'index.html');
const indexHtml = path.posix.join('/', 'index.html');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')
module.exports = env => ({
  entry: {
    index: './index.js',
  },
  experiments:{
    topLevelAwait:true
  },
  externals: {
    vue: 'Vue',
    vuex: 'Vuex',
    'vue-router': 'VueRouter',
    axios: 'axios',
    // 'ag-grid': 'agGrid',
    'ark-ui': 'Ark',
    'ark-bcl': '$Bcl',
    // jquery: '$',
    ztree: 'ztree',
  },
  devServer: {
    // compress: true,
    stats:{
      errorDetails:true,
    },
    port: 8209,
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
        context: proxyListForKABIN,
        target,
        changeOrigin: true
      },
      {
        context: proxyListForOMS,
        target,
        changeOrigin: true
      },
      {
        context: '/api/rpt',
        // target: 'http://47.99.229.124:9093' // 打印
        target: 'http://r3dev.qiaodan.com:26666', // 打印李宁环境
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
        // target: 'http://jflow-shangfei-yf.dev.burgeononline.com/', // 商飞环境
        // target: 'http://syman-jflow-standard.dev.burgeononline.com', // 新版jflow
        // target: 'http://jflow-dev-1-4.dev.burgeononline.com', // 商飞环境
        // target: ' http://jflow-syman-dev.dev.burgeononline.com/', // 商飞测试环境
        target: 'http://r3.burgeon.cn:28888/', // 卡宾环境
        // target: ' http://zhixiao-jflow.pro.burgeononline.com/', // 知晓环境
        // target: 'http://jflow-qiaodan.dev.burgeononline.com', // 乔丹测试环境
        changeOrigin: true
      }
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
    exprContextCritical: false,
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
          loader: 'style-loader',
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
              limit: 10000,
              name: '[path][name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          { 
            loader: "svg-sprite-loader",
            options: {
                symbolId: "icon-[name]"
            }
          },
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
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
    new SpriteLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env.BUILD_ENV': JSON.stringify(process.env.BUILD_ENV)
    }),
    new MiniCssExtractPlugin({
      filename: 'r3.css',
    }),
    new CleanWebpackPlugin([env && env.production ? 'dist' : 'devDist']),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      chunksSortMode: 'none',
      title: env && env.production ? projectConfig.projectsTitle : `Debug:${projectConfig.projectsTitle}`,
      template: './index.html',
      templateParameters: (compilation, assets, assetTags, options) => {
        if(process.env.BUILD_ENV ==='oss_no' || process.env.BUILD_ENV ==='oss'){
          // 兼容oss 配置
          return {
            Version:'1.4',
            enableGateWay:process.env.BUILD_ENV ==='oss_no' ? false :true,
            enableLoginPro:false,
          }
        }
        return {
          Version: process.env.BUILD_ENV ||'1.4',
          enableGateWay:process.env.BUILD_ENV =='1.4',
          enableLoginPro:false,
        }
      },
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
  
    // new webpack.DefinePlugin({
    //   'process.env.BUILD_ENV': JSON.stringify(process.env.BUILD_ENV)
    // }),
    // new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery',
    //   jquery: 'jquery',
    //   'window.jQuery': 'jquery'
    // })
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
        './ApiPermission': './src/__customize__/ApiPermissionWings/ApiPermission.vue',
        'index':'./share/index.share.js'
      },
      shared: ['vue', 'vuex','vue-router', '@syman/ark-ui', 'axios'],
    })
    // new ModuleFederationPlugin({
    //   name: '',
    //   remotes: {
    //     arkui_BCL: 'arkui_BCL@http://0.0.0.0:3800/remoteEntry.js',
    //     shared: ['vue', '@syman/ark-ui', 'axios']
    //   }
    // })
  ],
  mode: 'development',
  resolve: {
    extensions: ['.js', '.json', '.vue', '.css'],
    fallback: {
      path: require.resolve('path-browserify'),
      module: false,
      dgram: false,
      dns: false,
      fs:false,
      https: false,
      http:false,
      net: false,
      inspector:false,
      tls:false,
      crypto:false,
      request:false,
      stream_http:false,
      vm:false,
      stream:false,
      constants:false,
      os:false,
      worker_threads:false,
      child_process:false
    },
  },
});
