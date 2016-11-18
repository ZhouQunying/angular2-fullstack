import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extrct-text-webpack-plugin';

import helpers from './helpers';

module.exports = {
  entry: {
    'vendor': '../app/vendor.ts',
    'app': '../app/app.ts',
  },

  resolve: {
    extensions: ['', 'ts', 'js'],
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loaders: ['awesome-typescript-loader', 'angular2-template-loader'],
      },
      {
        test: /\.html$/,
        loader: 'html',
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file?name="assets/[name].[hash].[ext]',
      },
      {
        test: /\.css$/,
        exclude: helpers.root('src', 'app'),
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap'),
      },
      {
        test: /\.css$/,
        include: helpers.root('src', 'app'),
        loader: 'raw',
      },
    ],

    plugins: [
      new webpack.optimize.CommonChunkPlugin({
        name: ['app', 'vendor'],
      }),

      new HtmlWebpackPlugin({
        template: '../index.html',
      }),
    ]
  },
}
