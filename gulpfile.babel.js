'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import babelify from 'babelify';
import browserify from 'browserify';
import watchify from 'watchify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import mainBowerFiles from 'main-bower-files';
import {stream as wiredep} from 'wiredep';
import del from 'del';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('styles', ['inject:scss'], () => {
    return $.rubySass('client/app/app.scss', {
            // sourcemap: true,
            compass: true,
            style: 'expanded'
        }).on('error', $.rubySass.logError)
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.autoprefixer({browsers: ['last 1 version']}))
        // .pipe($.minifyCss())
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('.tmp/client/app'))
        .pipe(reload({stream: true}));
})

gulp.task('javascript', () => {
    const bundler = watchify(browserify('client/app/app.js', {debug: true})
        .transform('babelify', {presets: ['es2015']}));

    bundler.bundle()
        .on('error', (err) => {
            console.log(err);
        })
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe($.sourcemaps.init({loadMaps: true}))
        // .pipe($.uglify())
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('.tmp/client/app'))
        .pipe(reload({stream: true}));
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
    const fontPaths = 'client/assets/fonts/**/*';

    return gulp.src(mainBowerFiles({
            filter: '**/*.{eot, svg, ttf, woff, woff2}'
        }).concat(fontPaths))
        .pipe(gulp.dest('dist/client/assets/fonts'));
})

gulp.task('html', ['styles', 'javascript'], () => {
    return gulp.src('client/*.html')
        .pipe($.useref())
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.minifyCss({compatibility: '*'})))
        .pipe($.if('*.html', $.minifyHtml()))
        .pipe($.rev())
        .pipe($.revReplace())
        .pipe(gulp.dest('dist/client'));
})

gulp.task('wiredep', () => {
    gulp.src('client/*.scss')
        .pipe(wiredep())
        .pipe(gulp.dest('client/app'));

    gulp.src('client/*.html')
        .pipe(wiredep())
        .pipe(gulp.dest('client'));
})

gulp.task('inject:scss', () => {
    const scssSources = gulp.src('client/**/*.scss', {read: false});

    return gulp.src('client/app/app.scss')
        .pipe($.inject(scssSources, {
            relative: true,
            ignorePath: 'app.scss'
        }))
        .pipe(gulp.dest('client/app'));
})

gulp.task('lint', () => {
    return gulp.src(['**/*.js', '!node_modules/**', '!bower_components/**'])
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.eslint.failAfterError());
})

gulp.task('copy', () => {
    gulp.src(['bower.json', 'package.json'])
        .pipe(gulp.dest('dist'));

    gulp.src(['server/**/*', '!server/**/*.js'])
        .pipe(gulp.dest('dist/server'));
})

gulp.task('copy:server', () => {
    return gulp.src(['server/**/*', '!server/**/*.js'])
        .pipe(gulp.dest('dist/server'));
})

gulp.task('clean', () => {
    del(['.sass-cache', '.tmp', 'dist']).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });
})

gulp.task('serve', ['serve:node', 'html'], () => {
    browserSync.init({
        notify: false,
        port: 3000,
        server: {
            baseDir: ['.tmp/client', 'client'],
            routes: {
                '/bower_components': 'bower_components'
            }
        }
    });

    gulp.watch([
        'client/**/*.html',
        'client/assets/**/*'
    ]).on('change', reload);

    gulp.watch('client/**/*.scss', ['styles']);
    gulp.watch('client/**/*.js', ['javascript']);
    gulp.watch('bower.json', ['wiredep', 'fonts']);
});

gulp.task('serve:node', () => {
    $.nodemon({
        script: 'server',
        ext: 'js',
        ignore: ['client', 'gulpfile.babel.js'],
        env: {'NODE_ENV': 'development'}
    });
})

gulp.task('test:server', () => {
    return;
})

gulp.task('test:client', () => {
    return;
})

gulp.task('build', ['lint', 'build:server', 'build:client', 'copy']);

gulp.task('build:server', () => {
    return gulp.src('server/**/*')
        .pipe($.if('*.js', $.babel()))
        .pipe(gulp.dest('dist/server'));
})

gulp.task('build:client', ['html', 'images', 'fonts'], () => {
    return gulp.src('dist/**/*')
        .pipe($.size({
            title: 'build',
            gzip: true
        }));
})

gulp.task('default', ['build'], () => {
    $.nodemon({
        script: 'dist/server',
        ext: 'js',
        env: {'NODE_ENV': 'production'}
    });

    browserSync.init({
        notify: false,
        port: 3000,
        server: {
            baseDir: ['dist/client']
        }
    });
});