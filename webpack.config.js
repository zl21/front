const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const projectConfig = require('./project.config');

const target = projectConfig.target; // 框架研发网关开启环境
const proxyLists = ['/p/c'];
const proxyListsForGateway = ['/ad-app/p/c'];
const proxyListsForPalmCloud = ['/mboscloud-app'];


module.exports = env => ({
  entry: {
    index: './index.js',
  },
  externals: {
    vue: 'Vue',
    vuex: 'Vuex',
    'vue-router': 'VueRouter',
    axios: 'axios',
    'ag-grid': 'agGrid',
    'burgeon-ui': 'burgeon'
  },
  devServer: {
    compress: true,
    port: 8190,
    host: '127.0.0.1',
    open: false,
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join('/', env && env.production ? 'index.html' : 'index.dev.html') },
      ],
    },
    publicPath: '/',
    proxy: [{
      context: proxyLists,
      target
    }, {
      context: proxyListsForGateway,
      target
    }, {
      context: proxyListsForPalmCloud,
      target
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
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        use: [{
          loader: 'style-loader', // creates style nodes from JS strings
        }, {
          loader: 'css-loader', // translates CSS into CommonJS
        }, {
          loader: 'less-loader', // compiles Less to CSS
          options: { javascriptEnabled: true }
        }],
      },
      {
        test: /\.(png|jpg|gif|woff|woff2|eot|ttf|otf|svg)$/,
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
    new CleanWebpackPlugin([env && env.production ? 'dist' : 'devDist']),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      chunksSortMode: 'none',
      title: projectConfig.projectsTitle,
      template: env.production ? './index.html' : './index.dev.html',
      inject: true,
      favicon: projectConfig.projectIconPath,
    })
  ],
  mode: env && (env.production || env.publish) ? 'production' : 'development',
  resolve: {
    extensions: ['.js', '.json', '.vue', '.css'],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    }
  },
});
