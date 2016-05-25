import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import lazypipe from 'lazypipe';
import runSequence from 'run-sequence';
import { Server as KarmaServer } from 'karma';
import { Instrumenter } from 'isparta';
import { protractor, webdriver_update } from 'gulp-protractor';
import paths from './paths';

const $ = gulpLoadPlugins();

let mocha = lazypipe()
  .pipe($.mocha, {
    reporter: 'spec',
    timeout: 5000,
    require: [
      '../mocha.conf'
    ]
  });

let istanbul = lazypipe()
  .pipe($.istanbul.writeReports)
  .pipe($.istanbulEnforcer, {
    thresholds: {
      global: {
        lines: 80,
        statements: 80,
        branches: 80,
        functions: 80
      }
    },
    coverageDirectory: './coverage',
    rootDirectory: ''
  });

gulp.task('test:client', ['wiredep:test', 'constant'], cb => {
  new KarmaServer({
    configFile: '../karma.conf.js',
    singleRun: true
  }, cb).start();
});
gulp.task('test:server', cb => {
  runSequence(
    'env:all',
    'env:test',
    'mocha:unit',
    'mocha:integration',
    'mocha:coverage',
    cb
  );
});
gulp.task('mocha:unit', () => {
  return gulp.src(paths.server.test.unit)
    .pipe(mocha());
});
gulp.task('mocha:integration', () => {
  return gulp.src(paths.server.test.integration)
    .pipe(mocha());
});
gulp.task('coverage:pre', () => {
  return gulp.src(paths.server.scripts)
    .pipe($.istanbul({
      instrumenter: Instrumenter,
      includeUntested: true
    }))
    .pipe($.istanbul.hookRequire());
});
gulp.task('coverage:unit', () => {
  return gulp.src(paths.server.test.unit)
    .pipe(mocha())
    .pipe(istanbul())
});
gulp.task('coverage:integration', () => {
  return gulp.src(paths.server.test.integration)
    .pipe(mocha())
    .pipe(istanbul())
});
gulp.task('mocha:coverage', cb => {
  runSequence(
    'coverage:pre',
    'env:all',
    'env:test',
    'coverage:unit',
    'coverage:integration',
    cb
  );
});
// Downloads the selenium webdriver
gulp.task('webdriver_update', webdriver_update);
gulp.task('test:e2e', ['env:all', 'env:test', 'start:server', 'webdriver_update'], cb => {
  gulp.src('e2e/**/*.spec.js')
    .pipe(protractor({
      configFile: '../protractor.conf.js'
    })).on('error', err => {
      console.log(err)
    }).on('end', () => {
      process.exit();
    });
});
