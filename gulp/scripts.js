import gulp from 'gulp';
import _ from 'lodash';
import gulpLoadPlugins from 'gulp-load-plugins';
import paths from './paths';

const $ = gulpLoadPlugins();

gulp.task('transpile:client', () => {
  return gulp.src(paths.client.scripts)
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      plugins: [
        'transform-class-properties'
      ]
    }))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp'));
});
gulp.task('transpile:server', () => {
  return gulp.src(_.union([paths.server.scripts], [paths.server.json]))
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      plugins: [
        'transform-class-properties',
        'transform-runtime'
      ]
    }))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('dist/server'));
});
