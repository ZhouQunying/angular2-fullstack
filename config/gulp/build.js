import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';
import del from 'del';
import _ from 'lodash';

const $ = gulpLoadPlugins();

// Clean
gulp.task('clean', ['clean:dist']);

gulp.task('clean:dist', () => del(['dist/!(.git*)**'], { dot: true }));

// Copy
gulp.task('copy', ['copy:extras', 'copy:assets']);

gulp.task('copy:extras', () =>
  gulp.src([
    'client/favicon.ico',
    'client/robots.txt',
  ], { dot: true })
    .pipe(gulp.dest('dist/client')));

gulp.task('copy:assets', () =>
  gulp.src('client/assets/**/*')
    .pipe(gulp.dest('dist/client/assets')));

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
  gulp.src(_.union(['server/**/*.js'], ['server/**/*.json']))
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      plugins: [
        'transform-class-properties',
        'transform-runtime',
      ],
    }))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('dist/server')));
