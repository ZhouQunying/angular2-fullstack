import gulp from 'gulp';
import del from 'del';
import paths from './paths';

gulp.task('clean', ['clean:tmp', 'clean:dist']);
gulp.task('clean:tmp', () => del(['.tmp/**/*'], { dot: true }));
gulp.task('clean:dist', () => del(['dist/!(.git*|.openshift|Procfile)**'], { dot: true }));