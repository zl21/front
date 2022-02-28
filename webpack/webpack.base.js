const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const webpack = require('webpack')
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')

const projectConfig = require('../projectConfig/project.config')
const target = projectConfig.target // 框架研发网关开启环境
const proxyLists = [
  '/p/c',
  '/r3-cp',
  '/r3-oc-oms',
  '/p/cs',
  '/frr-center',
  '/eplan-center',
  '/ad-app',
  '/r3/qiaochu',
  '/retailcloud-crm2',
  '/retailcloud-official',
  '/ishop-synchronize',
  '/asynctask',
]
const proxyListsForGateway = ['/ad-app/p/c', '/asynctask/p/cs']
const proxyListsForIShop = [
  '/ishopad-app',
  '/ishopplatform/p/c',
  '/ishopbill/p/c',
  '/ishopbase/p/c',
  '/ishopcrm/p/cs/',
]
const proxyListsForPalmCloud = ['/mboscloud-app']
const proxyListsForPalmZx = ['/zhixiao-app']
const proxyListForShangFei = ['/user-center', '/shangfei', '/tr-center']
const proxyListForWuliu = ['/wuliu-admin']
const proxyListForKABIN = ['/r3/cabben/pt']
const proxyListForOMS = [
  '/p/c',
  '/p/cs',
  '/api',
  '/ad-app',
  '/r3-ps',
  '/r3-cp',
  '/r3-st',
  '/r3-oc-oms',
  '/r3-vip',
  '/r3-ipcs',
  '/asynctask/p/c',
  '/r3-pm',
  '/r3-ac',
  '/r3-sg',
]

module.exports = {
  context: path.resolve(__dirname, '../'),
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
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '[path][name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              symbolId: 'icon-[name]',
            },
          },
        ],
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
      'process.env.BUILD_ENV': JSON.stringify(process.env.BUILD_ENV),
    }),
    new VueLoaderPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.json', '.vue', '.css'],
  },
  externals: {
    vue: 'Vue',
    vuex: 'Vuex',
    'vue-router': 'VueRouter',
    axios: 'axios',
    'ark-ui': 'Ark',
    'ark-bcl': '$Bcl',
    ztree: 'ztree',
  },
  devServer: {
    stats: {
      errorDetails: true,
    },
    port: 8209,
    host: '0.0.0.0',
    open: true,
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: './index.html' },
      ],
    },
    publicPath: '/',
    proxy: [
      {
        context: proxyListsForIShop,
        target,
        changeOrigin: true,
      },
      {
        context: proxyListForShangFei,
        target,
        changeOrigin: true,
      },
      {
        context: proxyListForWuliu,
        target,
        changeOrigin: true,
      },

      {
        context: proxyLists,
        target,
        changeOrigin: true,
      },
      {
        context: proxyListsForGateway,
        target,
        changeOrigin: true,
      },
      {
        context: proxyListsForPalmCloud,
        target,
        changeOrigin: true,
      },
      {
        context: proxyListsForPalmZx,
        target,
        changeOrigin: true,
      },
      {
        context: proxyListForKABIN,
        target,
        changeOrigin: true,
      },
      {
        context: proxyListForOMS,
        target,
        changeOrigin: true,
      },
      {
        context: '/api/rpt',
        // target: 'http://47.99.229.124:9093' // 打印
        target: 'http://r3dev.qiaodan.com:26666', // 打印李宁环境
        changeOrigin: true,
      },
      {
        context: '/api',
        // target: 'http://47.99.229.124:9093' // 打印
        target: 'http://106.15.24.156:19999', // 打印李宁环境
        changeOrigin: true,
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
        changeOrigin: true,
      },
    ],
  },
  devtool: 'eval-cheap-module-source-map',
}
