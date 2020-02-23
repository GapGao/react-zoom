const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: './lib/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, './dist/'),
    publicPath: '/dist',
    libraryTarget: 'umd',
    library: 'react-zoom'
  },
  module: {
    rules: [
      {
        test: /.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react']
        },
        exclude: /node_modules/
      }
    ]
  },
  externals: {
    react: 'react'
  }
};
