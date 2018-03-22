/* eslint-disable no-unused-vars */
const webpack = require('webpack');
const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  name: 'server',
  target: 'node',
  entry: [path.join(__dirname, 'src/index.ts')],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js'
  },
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
