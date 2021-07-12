/* eslint-disable */
const path = require('path');
// const { VueLoaderPlugin } = require('vue-loader');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
const {ModuleFederationPlugin} = require('webpack').container;

const config = {
  entry: {
    index: './index.publish.js'
  },
  output: {
    filename: 'r3.min.js',
    path: path.join(__dirname, './r3.publish'),
    globalObject: 'this',
    library: 'R3',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    publicPath: './'
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
          loader: MiniCssExtractPlugin.loader,
        }, {
          loader: 'css-loader',
        }, {
          loader: 'less-loader',
          options: {javascriptEnabled: true}
        }],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000000,
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
    new MiniCssExtractPlugin({
      filename: 'r3.min.css',
    }),
    new CleanWebpackPlugin(['r3.publish']),
    new VueLoaderPlugin(),
    new copyWebpackPlugin([
      {
        from: path.resolve(__dirname, "./src/assets"),
        to: path.resolve(__dirname, "./r3.publish/src/assets")
      },
      {
        from: path.resolve(__dirname, "./src/index.less"),
        to: path.resolve(__dirname, "./r3.publish/src")
      },
    ]),
    // new ModuleFederationPlugin({
    //   name: '',
    //   remotes: {
    //     arkui_BCL: 'arkui_BCL@https://cdn.jsdelivr.net/npm/@syman/ark-ui-bcl@0.0.10/dist/remoteEntry.js',
    //     shared: ['vue', '@syman/ark-ui', 'axios']
    //   }
    // })
  ],
  mode: 'production',
  resolve: {
    extensions: ['.js', '.json', '.vue', '.css'],
    fallback: {
      path: require.resolve('path-browserify'),
      module: false,
      dgram: false,
      dns: false,
      fs: false,
      https: false,
      http: false,
      net: false,
      inspector: false,
      tls: false,
      crypto: false,
      request: false,
      stream_http: false,
      vm: false,
      stream: false,
      constants: false,
      os: false,
      worker_threads: false,
      child_process: false
    },
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
  },
}

if(process.env.BUILD_ENV === 'jenkins') {
  config.resolve.alias = {
    '@syman/ark-ui-bcl': path.resolve('static/js/ark-ui-bcl') // 本地调试业务组件
  }
}

module.exports = () => config;