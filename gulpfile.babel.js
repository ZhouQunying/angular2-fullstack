'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import babelify from 'babelify';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import mainBowerFiles from 'main-bower-files';
import lazypipe from 'lazypipe';
import {stream as wiredep} from 'wiredep';
import del from 'del';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('styles', () => {
    return $.rubySass('client/**/*.scss', {
            sourcemap: true,
            compass: true
        }).on('error', $.rubySass.logError)
        .pipe($.autoprefixer({browsers: ['last 1 version']}))
        // .pipe($.minifyCss())
        .pipe(gulp.dest('.tmp/client'))
        .pipe(reload({stream: true}));
})

gulp.task('javascript', () => {
    const bundler = browserify({
        entries: 'client/app/app.js',
        debug: true
    });

    return $.plumber()
        .pipe(bundler.transform("babelify", {presets: ["es2015"]}).bundle())
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe($.sourcemaps.init({loadMaps: true}))
        // .pipe($.uglify())
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('.tmp/client/app'));
})

gulp.task('rev', ['styles', 'javascript'], () => {
    return gulp.src(['.tmp/client/**/*.css', '.tmp/client/**/*.js'])
        .pipe($.rev())
        .pipe(gulp.dest('.tmp/client'))
        .pipe($.rev.manifest())
        .pipe(gulp.dest('.tmp/client'));
})

gulp.task('html', ['rev'], () => {
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
    const fontPaths = 'client/assets/fonts/**/*';

    return gulp.src(mainBowerFiles({
            filter: '**/*.{eot, svg, ttf, woff, woff2}'
        }).concat(fontPaths))
        .pipe(gulp.dest('.tmp/client/assets/fonts'))
        .pipe(gulp.dest('dist/client/assets/fonts'));
})

gulp.task('wiredep', () => {
    gulp.src('client/*.scss')
        .pipe(wiredep())
        .pipe(gulp.dest('client/app'));

    gulp.src('client/*.html')
        .pipe(wiredep())
        .pipe(gulp.dest('client'));
})

gulp.task('lint', () => {
    return gulp.src(['**/*.js', '!node_modules/**', '!bower_components/**'])
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.eslint.failAfterError());
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
        ignore: ['client/**/*.js', '*.js'],
        env: {'NODE_ENV': 'development'}
    });
})

gulp.task('serve:client', ['styles', 'javascript', 'fonts'], () => {
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
        'client/**/*.js',
        'client/assets/images/**/*',
        '.tmp/client/assets/fonts/**/*'
    ]).on('change', reload);

    gulp.watch('client/**/*.scss', ['styles']);
    gulp.watch('client/**/*.js', ['javascript']);
    gulp.watch('client/assets/fonts/**/*', ['fonts']);
    gulp.watch('bower.json', ['wiredep', 'fonts']);
})

gulp.task('test:server', () => {
    return;
})

gulp.task('test:client', () => {
    return;
})

gulp.task('build', ['build:server', 'build:client']);

gulp.task('build:server', () => {
    return gulp.src('server/**/*.js')
        .pipe($.babel())
        .pipe(gulp.dest('dist/server'));
})

gulp.task('build:client', ['lint', 'html', 'images', 'fonts'], () => {
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