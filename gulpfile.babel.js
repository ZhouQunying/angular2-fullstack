'use strict';

import gulp from 'gulp';
import _ from 'lodash';
import gulpLoadPlugins from 'gulp-load-plugins';
import lazypipe from 'lazypipe';

const paths = {
  client: {
    indexView: 'client/index.html',
    styles: 'client/{app,components}/**/*.scss',
    scripts: 'client/**/!(*.spec|*.mock).js',
    mainStyle: 'client/app/app.scss',
  },
  server: {},
  dist: 'dist'
};
const $ = gulpLoadPlugins();

let styles = lazypipe()
  .pipe($.sourcemaps.init)
  .pipe($.sass)
  .pipe($.autoprefixer, {browsers: ['last 1 version']})
  .pipe($.sourcemaps.write, '.');

let es6 = lazypipe()
  .pipe($.sourcemaps.init)
  .pipe($.babel)
  .pipe($.sourcemaps.write, '.');

// inject *.module.js sort
function sortModulesTop (file1, file2) {
  const module = /\.module\.js$/;
  const fileModule1 = module.test(file1.path);
  const fileModule2 = module.test(file2.path);
  if (fileModule1 === fileModule2) {
    if (file1.path < file2.path) {
      return -1;
    }
    if (file1.path > file2.path) {
      return 1;
    }
    else {
      return 0;
    }
  } else {
    return (fileModule1 ? -1 : 1);
  }
}

gulp.task('inject', cb => {
  $.runSequence(['inject:js', 'inject:scss'], cb);
});

gulp.task('inject:js', () => {
  return gulp.src(paths.client.indexView)
    .pipe($.inject(
      gulp.src(_.union([paths.client.scripts], ['!client/app/app.js']), {read: false})
        .pipe($.sort(sortModulesTop))
      ))
    .pipe(gulp.dest('client'));
});

// gulp.task('inject:css', () => {
//   return gulp.src(paths.client.indexView)
//     .pipe($.inject(
//       gulp.src('client/{app,components}/**/*.css', {read: false})
//         .pipe($.sort()),
//         {
//           starttag: '<!-- injector:css -->',
//           endtag: '<!-- endinjector:css -->',
//           transform: (filepath) => '<link rel="stylesheet" href="' + filepath.replace('/client/', '').replace('/.tmp/', '') + '">'
//         }))
//     .pipe(gulp.dest('client'));
// });

gulp.task('inject:scss', () => {
  return gulp.src(paths.client.mainStyle)
    .pipe($.inject(
      gulp.src(_.union([paths.client.styles], ['!' + paths.client.mainStyle]), {read: false})
        .pipe($.sort()),
        {
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

gulp.task('styles', () => {
  return gulp.src(paths.client.mainStyle)
    .pipe(styles())
    .pipe(gulp.dest('.tmp/app'));
});

gulp.task('es6:client', () => {
  return gulp.src(paths.client.scripts)
    .pipe(es6())
    .pipe(gulp.dest('.tmp/'));
});
