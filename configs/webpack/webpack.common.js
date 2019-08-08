const root = require('../helpers/root');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Module rules
const scssRule = require('./rules/scss.rule');
const fontRule = require('./rules/font.rule');
const imageRule = require('./rules/image.rule');

module.exports = {
  entry: './src/index.js',

  output: {
    filename: '[name].bundle.js',
    path: root(['dist']),
  },

  module: {
    rules: [ scssRule, imageRule, fontRule ],
  },

  resolve: {
    alias: {
      assets: root(['src', 'assets']),
    }
  },

  plugins: [
    new ProgressBarPlugin(),
    new HtmlWebpackPlugin({
      favicon: 'src/favicon.ico',
      filename: 'index.html',
      template: root(['src', 'index.html']),
    }),
  ],
};
