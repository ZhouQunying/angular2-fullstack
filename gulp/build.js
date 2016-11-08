import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';
import del from 'del';
import paths from './paths';

const $ = gulpLoadPlugins();

/********************
 * Clean
 ********************/

gulp.task('clean', ['clean:tmp', 'clean:dist']);
gulp.task('clean:tmp', () => del(['.tmp/**/*'], { dot: true }));
gulp.task('clean:dist', () => del(['dist/!(.git*)**'], { dot: true }));

/********************
 * Copy
 ********************/

gulp.task('copy:extras', () => {
  return gulp.src([
    'client/favicon.ico',
    'client/robots.txt',
  ], { dot: true })
    .pipe(gulp.dest('dist/client'));
});
gulp.task('copy:assets', () => {
  return gulp.src([paths.client.assets, '!client/assets/images/**/*'])
    .pipe(gulp.dest('dist/client/assets'));
});
gulp.task('copy:server', () => {
  return gulp.src([
    'package.json',
  ], { cwdbase: true })
    .pipe(gulp.dest('dist'));
});

/********************
 * Build
 ********************/

gulp.task('build', cb => {
  runSequence(
    'clean',
    [
      'copy:extras',
      'copy:assets',
      'copy:server',
      'build:server',
    ],
    cb
  );
});

gulp.task('build:server', () => {
  return gulp.src(_.union(paths.server.scripts, ['server/**/*.json']))
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      plugins: [
        'transform-class-properties',
        'transform-runtime',
      ]
    }))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('dist/server'));
});
