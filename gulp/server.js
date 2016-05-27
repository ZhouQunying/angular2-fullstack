import gulp from 'gulp';
import _ from 'lodash';
import gulpLoadPlugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';
import nodemon from 'nodemon';
import http from 'http';
import open from 'open';
import paths from './paths';

const $ = gulpLoadPlugins();
let config;

/********************
 * Env
 ********************/

gulp.task('env:all', () => {
  let localConfig;
  try {
    localConfig = require('../server/config/local.env');
  } catch (e) {
    localConfig = {};
  }
  $.env({
    vars: localConfig
  });
});
gulp.task('env:test', () => {
  $.env({
    vars: { NODE_ENV: 'test' }
  });
});
gulp.task('env:prod', () => {
  $.env({
    vars: { NODE_ENV: 'production' }
  });
});

/********************
 * Server
 ********************/

gulp.task('start:client', cb => {
  whenServerReady(() => {
    open(`http://localhost:${config.port}`);
    cb();
  });
});
gulp.task('start:server', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  config = require('../server/config/environment');
  nodemon('-w server server')
    .on('log', onServerLog);
});
gulp.task('start:server:prod', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'production';
  config = require(`../dist/server/config/environment`);
  nodemon('-w dist/server dist/server')
    .on('log', onServerLog);
});
gulp.task('serve', cb => {
  runSequence(
    ['clean:tmp', 'constant'],
    ['lint:scripts', 'inject'],
    'wiredep:client',
    ['es6:client', 'styles'],
    ['start:server', 'start:client'],
    'watch',
    cb
  );
});
gulp.task('serve:dist', () => {
  runSequence(
    'build',
    'env:all',
    'env:prod',
    ['start:server:prod', 'start:client'],
    cb
  );
});

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
    port: config.port
  };
  http
    .get(options, () => cb(true))
    .on('error', () => cb(false));
}

// Call page until first success
function whenServerReady(cb) {
  let serverReady = false;
  let appReadyInterval = setInterval(() =>
    checkAppReady((ready) => {
      if (!ready || serverReady) {
        return;
      }
      clearInterval(appReadyInterval);
      serverReady = true;
      cb();
    }),
    100);
}
