import gulp from 'gulp';
import _ from 'lodash';
import gulpLoadPlugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';
import { stream as wiredep } from 'wiredep';
import paths from './paths';

const $ = gulpLoadPlugins();

/********************
 * Wiredep
 ********************/

gulp.task('wiredep:client', () => {
  return gulp.src(paths.client.indexHtml)
    .pipe(wiredep({
      exclude: [
        /bootstrap.css/
      ],
      ignorePath: 'client'
    }))
    .pipe(gulp.dest('client'));
});
gulp.task('wiredep:test', () => {
  return gulp.src('karma.conf.js')
    .pipe(wiredep({
      exclude: [
        /bootstrap.css/
      ],
      devDependencies: true
    }))
    .pipe(gulp.dest('./'));
});

/********************
 * Inject
 ********************/

gulp.task('inject', cb => runSequence(['inject:js', 'inject:css', 'inject:scss'], cb));
gulp.task('inject:js', () => {
  return gulp.src(paths.client.indexHtml)
    .pipe($.inject(
      gulp.src(_.union([paths.client.scripts], ['!client/app/app.js']), { read: false })
        .pipe($.sort(sortModulesTop)), {
          starttag: '<!-- inject:js -->',
          endtag: '<!-- endinject -->',
          transform: (filepath) => '<script src="' + filepath.replace('/client/', '') + '"></script>'
        }))
    .pipe(gulp.dest('client'));
});
gulp.task('inject:css', () => {
  return gulp.src(paths.client.indexHtml)
    .pipe($.inject(
      gulp.src('client/{app,components}/**/*.css', {read: false})
        .pipe($.sort()), {
          starttag: '<!-- inject:css -->',
          endtag: '<!-- endinject:css -->',
          transform: filepath => '<link rel="stylesheet" href="' + filepath.replace('/client/', '').replace('/.tmp/', '') + '">'
        }))
    .pipe(gulp.dest('client'));
});
gulp.task('inject:scss', () => {
  return gulp.src(paths.client.mainStyle)
    .pipe($.inject(
      gulp.src(_.union([paths.client.styles], [`!${paths.client.mainStyle}`]), { read: false })
      .pipe($.sort()), {
        transform: (filePath) => {
          let newPath = filePath
            .replace('/client/app/', '')
            .replace('/client/components/', '../components/')
            .replace('.scss', '');
          return `@import "${newPath}";`;
        }
      }))
    .pipe(gulp.dest('client/app'));
});

// Inject *.module.js sort
function sortModulesTop(file1, file2) {
  const module = /\.module\.js$/;
  const fileModule1 = module.test(file1.path);
  const fileModule2 = module.test(file2.path);

  if (fileModule1 === fileModule2) {
    if (file1.path < file2.path) {
      return -1;
    }
    if (file1.path > file2.path) {
      return 1;
    } else {
      return 0;
    }
  } else {
    return (fileModule1 ? -1 : 1);
  }
}
