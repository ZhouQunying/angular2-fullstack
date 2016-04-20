'use strict';

import gulp from 'gulp';
import _ from 'lodash';
import gulpLoadPlugins from 'gulp-load-plugins';

const clientPath = 'client';
const serverPath = 'server';
const paths = {
  client: {
    mainView: `${clientPath}/index.html`
  },
  server: {},
  dist: 'dist'
};
const plugins = gulpLoadPlugins();

gulp.task('inject', cb => {
  plugins.runSequence(['inject:js', 'inject:css', 'inject:scss'], cb);
});

gulp.task('inject:js', () => {
  return gulp.src(paths.client.mainView)
    .pipe(plugins.inject());
});
