import gulp from 'gulp';
import webpack from 'webpack-stream';

gulp.task('webpack', () => {
  return gulp.src(['client/main.ts', 'client/vendor.ts'])
    .pipe(webpack(require('../client/config/webpack.dev.js')))
    .pipe(gulp.dest('dist/'));
});
