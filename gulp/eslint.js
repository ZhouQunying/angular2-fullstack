import gulp from 'gulp';
import _ from 'lodash';
import gulpLoadPlugins from 'gulp-load-plugins';
import lazypipe from 'lazypipe';
import runSequence from 'run-sequence';
import paths from './paths';

const $ = gulpLoadPlugins();

let lintScriptClient = lazypipe()
  .pipe($.eslint, { 'useEslintrc': true })
  .pipe($.eslint.format)
  .pipe($.eslint.failAfterError);

let lintScriptServer = lazypipe()
  .pipe($.eslint, { 'useEslintrc': true })
  .pipe($.eslint.format)
  .pipe($.eslint.failAfterError);

gulp.task('lint:scripts', cb => runSequence(['lint:scripts:client', 'lint:scripts:server'], cb));
gulp.task('lint:scripts:client', () => {
  return gulp.src(_.union(
      [paths.client.scripts],
      _.map([paths.client.test], blob => `!${blob}`),
      ['!client/app/app.constant.js']
    ))
    .pipe(lintScriptClient());
});
gulp.task('lint:scripts:server', () => {
  return gulp.src(_.union(
      paths.server.scripts,
      _.map(paths.server.test, blob => `!${blob}`)
    ))
    .pipe(lintScriptServer());
});
gulp.task('lint:script:clientTest', () => {
  return gulp.src(paths.client.test)
    .pipe(lintScriptClient());
});
gulp.task('lint:script:serverTest', () => {
  return gulp.src(paths.server.test)
    .pipe(lintScriptServer());
});
