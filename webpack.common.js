const HtmlWebpackPlugin = require('html-webpack-plugin');

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
    new HtmlWebpackPlugin({
      title: 'Weather App',
      template: 'src/template.html',
    }),
  ],
};
