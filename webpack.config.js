const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const projectConfig = require('./project.config');

const proxyLists = ['/p/c'];
const proxyListsForGateway = ['/ad-app/p/c'];
const proxyListsForPalmCloud = ['/mboscloud-app'];

// const target = 'http://47.99.229.124:1024';  // 框架研发网关关闭环境
const target = projectConfig.target; // 框架研发网关开启环境
// const target = 'http://r3dev.qiaodan.com:22222 '; // 乔丹测试环境
// const target = 'http://r3dev.qiaodan.com:28888'; // 乔丹开发环境


const generatePlugins = (env) => {
  const plugins = [
    new CleanWebpackPlugin([env && env.production ? 'dist' : 'devDist']),
    new VueLoaderPlugin(),
  ];
  if (!env.publish) {
    plugins.push(new HtmlWebpackPlugin({
      chunksSortMode: 'none',
      title: projectConfig.projectsTitle,
      template: env.production ? './index.html' : './index.dev.html',
      inject: true,
      favicon: projectConfig.projectIconPath,
    }));
  }
  return plugins;
};

const generateDevTools = (env) => {
  if (env && env.production) { return 'source-map'; }
  if (env && env.publish) {
    return false; 
  }
  return 'cheap-module-eval-source-map';
};

const generateOutput = (env) => {
  if (env.publish) {
    return {
      filename: '[name].js',
      chunkFilename: '[name].js',
      path: path.join(__dirname, './dist'),
      publicPath: '/',
    };
  } 
  return {
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].js',
    path: path.join(__dirname, './dist'),
    publicPath: '/',
    library: 'r3-frame',
    libraryTarget: 'umd',
    umdNamedDefine: true
  };
};

module.exports = env => ({
  entry: {
    index: './index.js',
  },
  externals: {
    vue: 'Vue',
    vuex: 'Vuex',
    'vue-router': 'VueRouter',
    axios: 'axios',
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
    }, {
      context: proxyListsForPalmCloud,
      target
    }]
   
  },
  target: 'web',
  devtool: generateDevTools(env),
  output: generateOutput(env),
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
  plugins: generatePlugins(env),
  mode: env && (env.production || env.publish) ? 'production' : 'development',
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
