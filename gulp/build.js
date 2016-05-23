import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';
import paths from './paths';

const $ = gulpLoadPlugins();

gulp.task('build', cb => {
  runSequence(
    [
      'clean:dist',
      'clean:tmp'
    ],
    'inject',
    'wiredep:client',
    [
      'build:images',
      'copy:extras',
      'copy:fonts',
      'copy:assets',
      'copy:server',
      'es6:server',
      'build:client'
    ],
    cb
  );
});
gulp.task('html', () => {
  return gulp.src('client/{app,components}/**/*.html')
    .pipe($.angularTemplatecache({
      module: 'fullstackApp'
    }))
    .pipe(gulp.dest('.tmp'));
});
gulp.task('constant', () => {
  let sharedConfig = require('../server/config/environment/shared');

  return $.ngConstant({
    name: 'fullstackApp.constants',
    deps: [],
    wrap: true,
    stream: true,
    constants: { appConfig: sharedConfig }
  })
    .pipe($.rename({
      basename: 'app.constant'
    }))
    .pipe(gulp.dest('client/app/'));
});
gulp.task('build:images', () => {
  return gulp.src(paths.client.images)
    .pipe($.imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true
    }))
    .pipe($.rev())
    .pipe(gulp.dest('dist/client/assets/images'))
    .pipe($.rev.manifest('dist/client/assets/rev-manifest.json', {
      base: 'dist/client/assets',
      merge: true
    }))
    .pipe(gulp.dest('dist/client/assets'));
});
gulp.task('copy:extras', () => {
  return gulp.src([
    'client/favicon.ico',
    'client/robots.txt',
    'client/.htaccess'
  ], { dot: true })
    .pipe(gulp.dest('dist/client'));
});
gulp.task('copy:assets', () => {
  return gulp.src([paths.client.assets, `!${paths.client.images}`])
    .pipe(gulp.dest('dist/client/asstes'));
});
gulp.task('copy:server', () => {
  return gulp.src([
    'package.json',
    'bower.json',
    '.bowerrc'
  ], { cwdbase: true })
    .pipe(gulp.dest('dist'));
});
