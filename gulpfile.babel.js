import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';
import nodemon from 'nodemon';
import http from 'http';
import open from 'open';
import del from 'del';
import lazypipe from 'lazypipe';
import { union } from 'lodash';

import localEnv from './server/config/local.env';

const $ = gulpLoadPlugins();
let config;

const eslintServer = lazypipe()
  .pipe($.eslint, { useEslintrc: true })
  .pipe($.eslint.format)
  .pipe($.eslint.failAfterError);

function onServerLog(log) {
  console.log($.util.colors.white('[') +
    $.util.colors.yellow('nodemon') +
    $.util.colors.white('] ') +
    log.message);
}

function checkAppReady(cb) {
  const options = {
    host: 'localhost',
    port: config.port,
  };

  http
    .get(options, () => cb(true))
    .on('error', () => cb(false));
}

function whenServerReady(cb) {
  let serverReady = false;
  const appReadyInterval = setInterval(() =>
    checkAppReady((ready) => {
      if (!ready || serverReady) {
        return;
      }
      clearInterval(appReadyInterval);
      serverReady = true;
      cb();
    }), 100);
}

// Env
gulp.task('env:all', () => {
  $.env({
    vars: localEnv,
  });
});
gulp.task('env:test', () => {
  $.env({
    vars: { NODE_ENV: 'test' },
  });
});
gulp.task('env:prod', () => {
  $.env({
    vars: { NODE_ENV: 'production' },
  });
});

// Eslint
gulp.task('eslint', () =>
  gulp.src('server/**/*.js')
    .pipe(eslintServer()));

// Watch
gulp.task('watch', () => {
  $.livereload.listen();

  $.watch('server/**/*.js')
    .pipe($.plumber())
    .pipe($.eslint({ useEslintrc: true }))
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError())
    .pipe($.livereload());
});

// Server
gulp.task('start:client', (cb) => {
  whenServerReady(() => {
    open(`http://localhost:${config.port}`);
    cb();
  });
});
gulp.task('start:server', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  config = require('./server/config/environment').default;
  nodemon('-w server server')
    .on('log', onServerLog);
});
gulp.task('start:server:prod', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'production';
  config = require('./dist/server/config/environment').default;
  nodemon('-w dist/server dist/server')
    .on('log', onServerLog);
});
gulp.task('serve', (cb) => {
  runSequence(
    'lint',
    ['start:server', 'start:client'],
    'watch',
    cb,
  );
});
gulp.task('serve:dist', (cb) => {
  runSequence(
    'build',
    'env:all',
    'env:prod',
    ['start:server:prod', 'start:client'],
    cb,
  );
});

// Clean
gulp.task('clean', () => del('dist', { dot: true }));

// Build
gulp.task('build', cb =>
  runSequence(
    'clean',
    'build:server',
    cb,
  ));

gulp.task('build:server', () =>
  gulp.src(union(['server/**/*.js'], ['server/**/*.json']))
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      plugins: [
        'transform-class-properties',
        'transform-runtime',
      ],
    }))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('dist/server')));

// Default
gulp.task('default', ['serve']);
