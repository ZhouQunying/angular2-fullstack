import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import paths from './paths';

const $ = gulpLoadPlugins();

gulp.task('styles', () => {
  return gulp.src(paths.client.mainStyle)
    .pipe($.sourcemaps.init())
    .pipe($.sass()
      .on('error', $.sass.logError))
    .pipe($.autoprefixer({ browsers: ['last 1 version'] }))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp/app'));
});
