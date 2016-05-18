'use strict';

var path = require('path');

module.exports = {
  devtool: 'eval-source-map',
  entry: [
    path.join(__dirname, 'source/scripts/bundle.js')
  ],
  output: {
    path: path.join(__dirname, '/dist/scripts/'),
    filename: 'bundle.js',
    publicPath: '/scripts/'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        "presets": ["react", "es2015", "stage-0"]
      }
    },
    {
      test: /\.scss$/,
      include: /source/,
      loaders: [
        'style',
        'css',
        'sass'
      ]
    }]
  },
  watch: true /* JUST IN CASE YOU HAVE TO DO SOMETHING HACKY ON THE SERVER YOU'D LIKE TO REGRET LATER */
};