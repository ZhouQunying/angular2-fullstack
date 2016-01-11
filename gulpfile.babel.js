'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';

// import babel from 'gulp-babel';
// import nodemon from 'gulp-nodemon';
// import sourcemaps from 'gulp-sourcemaps';
// import concat from 'gulp-concat';

const $ = gulpLoadPlugins();
const _browserSync = browserSync.create();

const dirs = {
    dest: './dist'
}

// gulp.task('build', () => {
//     return gulp.src('client/**/*.js')
//         .pipe($.sourcemaps.init())
//         .pipe($.babel({
//             presets: ['es2015'],
//             plugins: ['transform-runtime']
//         }))
//         .pipe($.concat('main.js'))
//         .pipe($.sourcemaps.write('.'))
//         .pipe(gulp.dest(dirs.dest));
// })

gulp.task('default', () => {
    return gulp.src('server/**/*.js')
        .pipe($.sourcemaps.init())
        .pipe($.babel())
})

gulp.task('clean', () => {
    del([dirs.dest]).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });
})

gulp.task('serve', () => {
    $.nodemon({
        tasks: ['default'],
        script: './server/app.js',
        ext: 'js',
        env: {'NODE_ENV': 'development'}
    });
})