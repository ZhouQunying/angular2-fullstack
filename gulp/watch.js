import gulp from 'gulp';
import _ from 'lodash';
import gulpLoadPlugins from 'gulp-load-plugins';
import paths from './paths';

const $ = gulpLoadPlugins();

gulp.task('watch', () => {
  $.liverload.listen();

  $.watch(paths.client.styles, () => {
    gulp.src(paths.client.mainStyle)
      .pipe($.plumber())
      .pipe($.sourcemaps.init)
      .pipe($.sass)
      .pipe($.autoprefixer, { browsers: ['last 1 version'] })
      .pipe($.sourcemaps.write, '.');
      .pipe(gulp.dest('.tmp/app'))
      .pipe($.liverload());
  });

  $.watch(paths.client.html)
    .pipe($.plumber())
    .pipe($.liverload());

  $.watch(paths.client.scripts)
    .pipe($.plumber())
    .pipe($.sourcemaps.init)
    .pipe($.babel, {
      plugins: [
        'transform-class-properties'
      ]
    })
    .pipe($.sourcemaps.write, '.');
    .pipe(gulp.dest('.tmp'))
    .pipe($.liverload());

  $.watch(_.union(paths.server.srcripts, paths.client.test, paths.server.test.unit, paths.server.test.intergration))
    .pipe($.plumber())
    .pipe($.eslint({ 'useEslintrc': true }))
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
    .pipe($.liverload());

  $.watch('bower.json', ['wiredep:client']);
});