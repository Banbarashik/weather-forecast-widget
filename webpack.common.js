const HtmlWebpackPlugin = require('html-webpack-plugin');

const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  entry: {
    index: './src/js/controller.js',
  },
  module: {
    rules: [
      {
        test: /\.(jpeg|jpg|png|gif|svg|webp|mp4|webm)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new NodePolyfillPlugin(),
    new HtmlWebpackPlugin({
      title: 'Weather Forecast Widget',
      template: 'src/template.html',
    }),
  ],
};
