'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import lazypipe from 'lazypipe';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

// styles
gulp.task('styles', () => {
    return gulp.src('client/**/*.scss')
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.compass({
            css: '.tmp/client',
            sass: 'client',
            image: 'client/assets/images'
        })).on('error', (err) => {
            console.log(err);
            this.end();
        })
        .pipe($.autoprefixer({browsers: ['last 1 version']}))
        .pipe($.minifyCss())
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('.tmp/client'))
        .pipe(reload({stream: true}));
})

// javascript
gulp.task('lint', () => {
    return gulp.src(['**/*.js', '!node_modules/**', '!client/bower_components/**'])
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.eslint.failAfterError());
})

// html
gulp.task('html', ['styles'], () => {
    const htmlTasks = lazypipe()
        .pipe($.useref)
        .pipe(() => {
            return $.if('*.js', $.uglify());
        })
        .pipe(() => {
            return $.if('*.css', $.minifyCss({compatibility: '*'}));
        })
        .pipe(() => {
            return $.if('*.html', $.minifyHtml());
        });

    return gulp.src('client/*.html')
        .pipe(htmlTasks())
        .pipe(gulp.dest('dist/client'));
})

// images
gulp.task('images', () => {
    return gulp.src('client/assets/images/**/*')
})

// serve
gulp.task('serve', ['serve:node', 'styles', 'serve:client']);

gulp.task('serve:node', () => {
    $.nodemon({
        script: 'server',
        ext: 'js',
        ignore: ['client/**/*.js'],
        env: {'NODE_ENV': 'development'}
    });
})

gulp.task('serve:client', () => {
    browserSync.init({
        notify: false,
        port: 9000,
        server: {
            baseDir: ['.tmp/client', 'client'],
            routes: {
                '/bower_components': 'client/bower_components'
            }
        }
    });

    gulp.watch([
        'client/**/*.html',
        'client/**/*.js',
        'client/assets/images/**/*',
        '.tmp/fonts/**/*'
    ]).on('change', reload);

    gulp.watch('client/**/*.scss', ['styles']);
})

gulp.task('serve:dist', () => {
    $.nodemon({
        script: 'dist/server',
        ext: 'js',
        env: {'NODE_ENV': 'production'}
    });

    browserSync.init({
        notify: false,
        port: 9000,
        server: {
            baseDir: ['dist/client'],
            routes: {
                '/bower_components': 'dist/client/bower_components'
            }
        }
    });
})

// clean
gulp.task('clean', () => {
    del(['.sass-cache', '.tmp', 'dist']).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });
})