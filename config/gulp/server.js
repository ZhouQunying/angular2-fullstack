import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';
import nodemon from 'nodemon';
import http from 'http';
import open from 'open';

import localEnv from '../../server/config/local.env';

const $ = gulpLoadPlugins();
let config;

// Server log
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

// Call page until first success
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

// Env
gulp.task('env:all', () => {
  $.env({
    vars: localEnv,
  });
});
// gulp.task('env:test', () => {
//   $.env({
//     vars: { NODE_ENV: 'test' },
//   });
// });
gulp.task('env:prod', () => {
  $.env({
    vars: { NODE_ENV: 'production' },
  });
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
  config = require('../../server/config/environment').default;
  nodemon('-w server server')
    .on('log', onServerLog);
});
// gulp.task('start:server:prod', () => {
//   process.env.NODE_ENV = process.env.NODE_ENV || 'production';
//   config = require('../../dist/server/config/environment').default;
//   nodemon('-w dist/server dist/server')
//     .on('log', onServerLog);
// });
gulp.task('serve', (cb) => {
  runSequence(
    // ['lint:scripts'],
    'webpack',
    [
      'start:server',
      'start:client',
    ],
    'watch',
    cb,
  );
});
// gulp.task('serve:dist', (cb) => {
//   runSequence(
//     'build',
//     'env:all',
//     'env:prod',
//     ['start:server:prod', 'start:client'],
//     cb,
//   );
// });

// Default
gulp.task('default', ['serve']);
