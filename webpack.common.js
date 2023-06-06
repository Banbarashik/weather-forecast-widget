const HtmlWebpackPlugin = require('html-webpack-plugin');
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');

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
    new PreloadWebpackPlugin({
      rel: 'prefetch',
      include: 'allAssets',
      as(entry) {
        if (/\.jpg$/.test(entry)) return 'image';
        if (/\.webm$/.test(entry)) return 'video';
        return 'script';
      },
      fileWhitelist: [/\.(jpg|webm)$/],
    }),
  ],
};
