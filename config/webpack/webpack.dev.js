import webpackMerge from 'webpack-merge';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import commonConfig from './webpack.common';
import config from '../../server/config/environment';

export default webpackMerge(commonConfig, {
  devtool: 'cheap-module.eval-source-map',

  output: {
    path: './dist/client',
    publicPath: `http://localhost:${config.port}/`,
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
  },

  plugins: [
    new ExtractTextPlugin('[name].css'),
  ],

  devServer: {
    historyApiFallback: true,
    stats: 'minimal',
  },
});
