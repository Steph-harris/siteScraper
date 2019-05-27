var nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './public/scripts/bxScrs.js',
  output: {filename:'bundle.js'},
  module: {
    loaders: [
      {
        test: /\.js?/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  target: 'node',
  externals: [nodeExternals()]
};
