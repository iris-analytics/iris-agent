const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const pkg = require('./../../package.json');

module.exports = {
  mode: 'development',
  entry: [
    'react-hot-loader/patch',
    path.join(__dirname , './client/index.js'),
  ],
  output: {
    path: path.join(__dirname , './client/'),
    filename: '[name][hash].js',
    publicPath: '/',
  },
  devServer: {
    contentBase: path.join(__dirname , './client/'),
    hot: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: [pkg.name],
      template: './index.html',
    }),
  ],
};
