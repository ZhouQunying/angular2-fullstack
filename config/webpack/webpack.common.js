import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default {
  entry: {
    vendor: 'client/vendor.ts',
    app: 'client/main.ts',
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
        exclude: 'client',
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap'),
      },
      {
        test: /\.css$/,
        include: 'client',
        loader: 'raw',
      },
    ],

    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: ['app', 'vendor'],
      }),

      new HtmlWebpackPlugin({
        template: 'client/index.html',
      }),
    ],
  },
};
