/* eslint-disable */
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');



module.exports = () => ({
  entry: {
    index: './index.publish.js'
  },
  output: {
    filename: 'r3.min.js',
    path: path.join(__dirname, './r3.publish'),
    globalObject: 'this',
    library: 'R3',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  // devtool: 'cheap-module-eval-source-map',
  devtool: '#eval-source-map',
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
        test: /\.(sa|sc|c|le)ss$/,
        use: [{
          // loader: env && env.production ? MiniCssExtractPlugin.loader : 'style-loader',
          loader: MiniCssExtractPlugin.loader,
        }, {
          loader: 'css-loader',
        }, {
          loader: 'less-loader',
          options: { javascriptEnabled: true }
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
    new copyWebpackPlugin([{
        from: path.resolve(__dirname, "./src/assets/theme/custom.less"),
        to: path.resolve(__dirname, "./r3.publish/src/assets/theme")
    }])
  ],
  mode: 'production',
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
  },
});
