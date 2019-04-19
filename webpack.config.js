const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const projectConfig = require('./project.config');

const proxyLists = ['/p/c'];
const proxyListsForGateway = ['/ad-app/p/c'];

const target = 'http://47.99.229.124:10001'; // 框架研发网关开启环境
// const target = 'http://120.55.107.235:8090'; // 正式环境


module.exports = env => ({
  entry: {
    index: './index.js',
  },
  devServer: {
    compress: true,
    port: 8190,
    host: '127.0.0.1',
    open: false,
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join('/', 'index.html') },
      ],
    },
    publicPath: '/',
    proxy: [{
      context: proxyLists,
      target
    }, {
      context: proxyListsForGateway,
      target
    }]
   
  },
  target: 'web',
  devtool: env && env.production ? 'source-map' : 'cheap-module-eval-source-map',
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].js',
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
      chunksSortMode: 'none', // 为解决toposort的Cyclic dependency问题
      title: projectConfig.projectsTitle,
      template: './index.html',
      inject: true,
      favicon: projectConfig.projectIconPath,
    }),
  ],
  mode: env && env.production ? 'production' : 'development',
  resolve: {
    extensions: ['.js', '.json', '.vue', '.css'],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    // minimizer: [new UglifyJsPlugin({
    //   uglifyOptions: {
    //     compress: {
    //       drop_console: env && env.production
    //     }
    //   }
    // })]
  },
});
