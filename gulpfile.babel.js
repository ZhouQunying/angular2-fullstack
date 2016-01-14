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
const reload = browserSync.reload;

// const paths = {
//     client: {
//         sass: 'client/**/*.scss'
//     },
//     server: {
//         index: 'dist/server/app.js'
//     }
// }

// gulp.task('build', () => {
//     return gulp.src(['client/**/*.js'])
//         .pipe($.sourcemaps.init())
//         .pipe($.babel())
//         .pipe($.concat('main.js'))
//         .pipe($.sourcemaps.write('.tmp'))
//         .pipe(gulp.dest('dist/client'));
// })

gulp.task('default', () => {
    return gulp.src('server/**/*.js')
        .pipe($.sourcemaps.init())
        .pipe($.babel())
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('dist/server'));
})

// serve
gulp.task('serve', ['serve:node', 'serve: client'], () => {
    
})
gulp.task('serve:node', () => {
    $.nodemon({
        script: 'server',
        ext: 'js',
        env: {'NODE_ENV': 'development'}
    });
})
gulp.task('serve:client', () => {
    browserSync.init({
        notify: false,
        port: 9000,
        server: {
            baseDir: ['.tmp', 'client']
        }
    });
    // gulp.watch('client/**/*.scss', ['sass']);
    // gulp.watch('client/**/*.html').on('change', reload);
})

// clean
gulp.task('clean', () => {
    del(['.tmp', 'dist']).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });
})

// styles
gulp.task('styles', () => {
    return gulp.src('client/**/*.scss')
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            outputStyle: 'compressed',
            precsion: 10,
            includePaths: ['.']
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer({browsers: ['last 1 version']}))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('.tmp/styles'))
        .pipe(reload({stream: true}));
})

gulp.task('styles:watch', () => {
    gulp.watch('client/**/*.scss', ['styles'])
})