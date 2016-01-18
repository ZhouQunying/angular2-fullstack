'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import lazypipe from 'lazypipe';
import mainBowerFiles from 'main-bower-files';
import {stream as wiredep} from 'wiredep';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

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

gulp.task('lint', () => {
    return gulp.src(['**/*.js', '!node_modules/**', '!bower_components/**'])
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.eslint.failAfterError());
})

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

gulp.task('images', () => {
    return gulp.src('client/assets/images/**/*')
        .pipe($.if($.isFile, $.cache($.imagemin({
            progressive: true,
            interlaced: true,
            svgoPlugins: [{cleanupIDs: false}]
        })).on('error', (err) => {
            console.log(err);
            this.end();
        })))
        .pipe(gulp.dest('dist/client/assets/images'));
})

gulp.task('fonts', () => {
    const fontPaths = 'bower_components/font-awesome/fonts/**/*';

    return gulp.src(mainBowerFiles({
            filter: '**/*.{eot, svg, ttf, woff, woff2}'
        }).concat(fontPaths))
        .pipe(gulp.dest('.tmp/client/assets/fonts'))
        .pipe(gulp.dest('dist/client/assets/fonts'));
})

gulp.task('clean', () => {
    del(['.sass-cache', '.tmp', 'dist']).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });
})

gulp.task('serve', ['serve:node', 'serve:client']);

gulp.task('serve:node', () => {
    $.nodemon({
        script: 'server',
        ext: 'js',
        ignore: ['client/**/*.js'],
        env: {'NODE_ENV': 'development'}
    });
})

gulp.task('serve:client', ['styles', 'fonts'], () => {
    browserSync.init({
        notify: false,
        port: 9000,
        server: {
            baseDir: ['.tmp/client', 'client'],
            routes: {
                '/bower_components': 'bower_components'
            }
        }
    });

    gulp.watch([
        'client/**/*.html',
        'client/**/*.js',
        'client/assets/images/**/*',
        '.tmp/client/assets/fonts/**/*'
    ]).on('change', reload);

    gulp.watch('client/**/*.scss', ['styles']);
    gulp.watch('client/assets/fonts/**/*', ['fonts']);
    gulp.watch('bower.json', ['wiredep', 'fonts']);
})

gulp.task('test:server', () => {
    return;
})

gulp.task('test:client', () => {
    return;
})

gulp.task('wiredep', () => {
    gulp.src('client/*.scss')
        .pipe(wiredep())
        .pipe(gulp.dest('client/app'));

    gulp.src('client/*.html')
        .pipe(wiredep())
        .pipe(gulp.dest('client'));
})

gulp.task('build', ['lint', 'html', 'images', 'fonts'], () => {
    return gulp.src('dist/**/*')
        .pipe($.size({
            title: 'build',
            gzip: true
        }));
})

gulp.task('default', () => {
    // $.nodemon({
    //     script: 'dist/server',
    //     ext: 'js',
    //     env: {'NODE_ENV': 'production'}
    // });

    browserSync.init({
        notify: false,
        port: 9000,
        server: {
            baseDir: ['dist/client']
        }
    });
});