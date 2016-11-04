import gulp from 'gulp';
import _ from 'lodash';
import gulpLoadPlugins from 'gulp-load-plugins';
import paths from './paths';

const $ = gulpLoadPlugins();

gulp.task('watch', () => {
  const tsResult = gulp.src(paths.client.scripts)
    .pipe($.sourcemaps.init())
    .pipe($.typescript());

  $.livereload.listen();

  $.watch(paths.client.styles, () => {
    gulp.src(paths.client.mainStyle)
      .pipe($.plumber())
      .pipe($.sourcemaps.init())
      .pipe($.sass())
      .pipe($.autoprefixer({ browsers: ['last 1 version'] }))
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest('.tmp/app'))
      .pipe($.livereload());
  });

  $.watch([paths.client.html, 'client/index.html'])
    .pipe($.plumber())
    .pipe($.livereload());

  $.watch(paths.client.scripts)
    .pipe($.plumber())
    .pipe(tsResult.js
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest('.tmp'))
      .pipe($.livereload())
    );

  $.watch(paths.server.scripts)
    .pipe($.plumber())
    .pipe($.eslint({ 'useEslintrc': true }))
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError())
    .pipe($.livereload());

  gulp.watch('bower.json', ['wiredep']);
});
