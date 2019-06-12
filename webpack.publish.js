/* eslint-disable */
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = () => ({
  entry: {
    index: './index.publish.js'
  },
  output: {
    filename: 'r3.min.js',
    path: path.join(__dirname, './publish'),
    globalObject: 'this',
    library: 'R3',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  devtool: 'source-map',
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
    'ag-grid': {
      commonjs: 'ag-grid',
      commonjs2: 'ag-grid',
      amd: 'ag-grid',
      root: 'agGrid'
    },
    'burgeon-ui': {
      commonjs: 'burgeon-ui',
      commonjs2: 'burgeon-ui',
      amd: 'burgeon-ui',
      root: 'burgeon'
    }
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
        test: /\.(png|jpg|gif|svg)$/,
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
    new CleanWebpackPlugin(['publish']),
    new VueLoaderPlugin(),
  ],
  mode: 'production',
  resolve: {
    extensions: ['.js', '.json', '.vue', '.css'],
  },
});
