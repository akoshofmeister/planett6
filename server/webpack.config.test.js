/* eslint-disable no-unused-vars */
const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  mode: 'development',
  name: 'server-test',
  target: 'node',
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: ['babel-loader', 'ts-loader']
      }
    ]
  },
  plugins: []
};
