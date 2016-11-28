import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import config from '../config/environment';
import {root} from './helpers';

export default {
  entry: {
    'vendor': path.join(config.root, 'client/vendor.ts'),
    'app': path.join(config.root, 'client/main.ts'),
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
        exclude: root('src', 'app'),
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap'),
      },
      {
        test: /\.css$/,
        include: root('src', 'app'),
        loader: 'raw',
      },
    ],

    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: ['app', 'vendor'],
      }),

      new HtmlWebpackPlugin({
        template: '../index.html',
      }),
    ],
  },
};
