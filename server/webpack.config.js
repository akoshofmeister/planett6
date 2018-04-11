/* eslint-disable no-unused-vars */
const webpack = require('webpack');
const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  mode: 'development',
  name: 'server',
  target: 'node',
  entry: [path.join(__dirname, 'src/index.ts')],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.ts', '.js', '.node']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: ['babel-loader', 'ts-loader']
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      }
    ]
  },
  optimization: {
    minimize: process.env.NODE_ENV === 'production'
  },
  devtool: 'inline-source-map'
};
