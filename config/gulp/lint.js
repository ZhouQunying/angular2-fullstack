import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import lazypipe from 'lazypipe';
import runSequence from 'run-sequence';

const $ = gulpLoadPlugins();
const lintScriptServer = lazypipe()
  .pipe($.eslint, { useEslintrc: true })
  .pipe($.eslint.format)
  .pipe($.eslint.failAfterError);

gulp.task('lint:scripts:client', () =>
  gulp.src('client/**/*.ts')
    .pipe($.tslint({ configuration: './tslint.json' }))
    .pipe($.tslint.report()));

gulp.task('lint:scripts:server', () =>
  gulp.src('server/**/*.js')
    .pipe(lintScriptServer()));

gulp.task('lint:scripts', cb => runSequence(['lint:scripts:client', 'lint:scripts:server'], cb));
