const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const projectConfig = require('./project.config');

module.exports = env => ({
  entry: {
    index: './index.js',
  },
  devServer: {
    compress: true,
    port: 8190,
    host: '127.0.0.1',
    open: true,
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join('/', 'index.html') },
      ],
    },
    publicPath: '/',
    proxy: {
      '/p/c': {
        // target: 'http://47.99.94.15:9090/mock/70/r3/1.4',
        target: 'http://47.99.229.124:1024',
        pathRewrite: {
          '^/p/c': '/p/c',
        },
      },
    },
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
    minimizer: [new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          drop_console: env && env.production
        }
      }
    })]
  },
});
