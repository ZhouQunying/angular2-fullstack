import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';
import nodemon from 'nodemon';
import del from 'del';
import { union } from 'lodash';

import localEnv from './src/config/local.env';

const $ = gulpLoadPlugins();

function onServerLog(log) {
  console.log($.util.colors.white('[') +
    $.util.colors.yellow('nodemon') +
    $.util.colors.white('] ') +
    log.message);
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

gulp.task('eslint', () => {
  gulp.src('src/**/*.js')
    .pipe($.plumber())
    .pipe($.eslint({ useEslintrc: true }))
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});

// Watch
gulp.task('watch', () => {
  $.livereload.listen();

  gulp.watch('src/**/*.js', (event) => {
    gulp.src(event.path)
      .pipe($.plumber())
      .pipe($.eslint({ useEslintrc: true }))
      .pipe($.eslint.format())
      .pipe($.eslint.failAfterError())
      .pipe($.livereload());
  });
});

// Server
gulp.task('node', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  nodemon('-w src src')
    .on('log', onServerLog);
});
gulp.task('node:prod', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'production';
  nodemon('-w dist/src dist/src')
    .on('log', onServerLog);
});
gulp.task('serve', (cb) => {
  runSequence(
    'eslint',
    'node',
    'watch',
    cb,
  );
});
gulp.task('serve:dist', (cb) => {
  runSequence(
    'build',
    'env:all',
    'env:prod',
    'node:prod',
    cb,
  );
});

// Clean
gulp.task('clean', () => del('dist', { dot: true }));

// Build
gulp.task('build', ['clean'], () =>
  gulp.src(union(['src/**/*.js'], ['src/**/*.json']))
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      plugins: [
        'transform-class-properties',
        'transform-runtime',
      ],
    }))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('dist/src')));

// Default
gulp.task('default', ['serve']);
