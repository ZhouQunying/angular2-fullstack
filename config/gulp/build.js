import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';
import del from 'del';
import { union } from 'lodash';

const $ = gulpLoadPlugins();

// Clean
gulp.task('clean', () => del(['dist/!(.git*)**'], { dot: true }));

// Copy
gulp.task('copy', () =>
  gulp.src([
    'client/favicon.ico',
    'client/robots.txt',
  ], { dot: true })
    .pipe(gulp.dest('dist/client')));

// Build
gulp.task('build', cb =>
  runSequence(
    'clean',
    [
      'copy',
      'build:server',
    ],
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
