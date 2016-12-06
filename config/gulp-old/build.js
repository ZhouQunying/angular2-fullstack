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
gulp.task('clean:dist', () => del(['dist/!(.git*|.openshift|Procfile)**'], { dot: true }));

/********************
 * Build
 ********************/

gulp.task('build', cb => {
  runSequence(
    [
      'clean:dist',
      'clean:tmp'
    ],
    [
      'build:images',
      'copy:extras',
      'copy:assets',
      'copy:server',
      'scripts:server',
      'build:client'
    ],
    cb
  );
});
gulp.task('html', () => {
  return gulp.src('client/{app,components}/**/*.html')
    .pipe(gulp.dest('.tmp'));
});
gulp.task('build:images', () => {
  return gulp.src(paths.client.images)
    .pipe($.imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true
    }))
    .pipe($.rev())
    .pipe(gulp.dest('dist/client/assets/images'))
    .pipe($.rev.manifest('dist/client/assets/rev-manifest.json', {
      base: 'dist/client/assets',
      merge: true
    }))
    .pipe(gulp.dest('dist/client/assets'));
});
gulp.task('build:client', ['scripts:client', 'styles', 'html'], () => {
  const manifest = gulp.src('dist/client/assets/rev-manifest.json');
  const appFilter = $.filter('**/app.js', {restore: true});
  const jsFilter = $.filter('**/*.js', {restore: true});
  const cssFilter = $.filter('**/*.css', {restore: true});
  const htmlBlock = $.filter(['**/*.!(html)'], {restore: true});

  return gulp.src(paths.client.indexHtml)
    .pipe($.useref())
      .pipe(appFilter)
        .pipe($.addSrc.append('.tmp/templates.js'))
        .pipe($.concat('app/app.js'))
      .pipe(appFilter.restore)
      .pipe(jsFilter)
        .pipe($.uglify())
      .pipe(jsFilter.restore)
      .pipe(cssFilter)
        .pipe($.minifyCss({
          cache: true,
          processImportFrom: ['!fonts.googleapis.com']
        }))
      .pipe(cssFilter.restore)
      .pipe(htmlBlock)
        .pipe($.rev())
      .pipe(htmlBlock.restore)
    .pipe($.revReplace({manifest}))
    .pipe(gulp.dest('dist/client'));
});
gulp.task('copy:extras', () => {
  return gulp.src([
    'client/favicon.ico',
    'client/robots.txt',
    'client/.htaccess'
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
    'bower.json',
    '.bowerrc'
  ], { cwdbase: true })
    .pipe(gulp.dest('dist'));
});
