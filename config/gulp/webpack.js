import gulp from 'gulp';
import webpack from 'webpack-stream';

gulp.task('webpack', () =>
  gulp.src(['client/main.ts', 'client/shared/vendor.ts'])
    .pipe(webpack(require('../webpack/webpack.dev.js')))
    .pipe(gulp.dest('dist/')));
