import gulp from 'gulp';
import { stream as wiredep } from 'wiredep';
import paths from './paths';

gulp.task('wiredep:client', () => {
  return gulp.src(paths.client.indexHtml)
    .pipe(wiredep({
      exclude: [],
      ignorePath: 'client'
    }))
    .pipe(gulp.dest('client'));
});
gulp.task('wiredep:test', () => {
  return gulp.src('karma.conf.js')
    .pipe(wiredep({
      exclude: [],
      devDependencies: true
    }))
    .pipe(gulp.dest('./'));
});
