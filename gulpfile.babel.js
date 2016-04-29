'use strict';

import gulp from 'gulp';
import _ from 'lodash';
import gulpLoadPlugins from 'gulp-load-plugins';
import lazypipe from 'lazypipe';
import nodemon from 'nodemon';
import open from 'open';
import {stream as wiredep} from 'wiredep';

const paths = {
    client: {
        indexView: 'client/index.html',
        views: 'client/{app|components}/**/*.html',
        mainStyle: 'client/app/app.scss',
        styles: 'client/{app,components}/**/*.scss',
        scripts: 'client/**/!(*.spec|*.mock).js',
        test: 'client/{app,components}/**/*.{spec,mock}.js'
    },
    server: {
        scripts: [
          'server/**/!(*.spec|*.intergration).js',
          '!server/config/local.env.sample.js'
        ],
        json: 'server/**/*.json',
        test: {
            intergration: ['server/**/*.intergration.js', 'mocha.global.js'],
            unit: ['server/**/*.spec.js', 'mocha.global.js']
        }
    }
};
const $ = gulpLoadPlugins();

let styles = lazypipe()
    .pipe($.sourcemaps.init)
    .pipe($.sass)
    .pipe($.autoprefixer, { browsers: ['last 1 version'] })
    .pipe($.sourcemaps.write, '.');

let transpileClient = lazypipe()
    .pipe($.sourcemaps.init)
    .pipe($.babel, {
        plugins: [
            'transform-class-properties'
        ]
    })
    .pipe($.sourcemaps.write, '.');

let transplieServer = lazypipe()
    .pipe($.sourcemaps.init)
    .pipe($.bable, {
        plugins: [
            'transform-class-properties',
            'transform-runtime'
        ]
    })
    .pipe($.sourcemaps.write, '.');

let lintScriptClient = lazypipe()
    .pipe($.eslint({'useEslintrc': true}))
    .pipe($.eslint.format)
    .pipe($.eslint.failAfterError);

let lintScriptServer = lazypipe()
    .pipe($.eslint({'useEslintrc': true}))
    .pipe($.eslint.format)
    .pipe($.eslint.failAfterError);

// inject *.module.js sort
function sortModulesTop(file1, file2) {
    const module = /\.module\.js$/;
    const fileModule1 = module.test(file1.path);
    const fileModule2 = module.test(file2.path);
    if (fileModule1 === fileModule2) {
        if (file1.path < file2.path) {
            return -1;
        }
        if (file1.path > file2.path) {
            return 1;
        } else {
            return 0;
        }
    } else {
        return (fileModule1 ? -1 : 1);
    }
}

function checkAppReady(cb) {
    const options = {
        host: 'localhost',
        port: config.port
    };

    http.get(options, () => cb(true))
        .on('error', () => cb(false));
}

// call pate until first success
function whenServerReady (cb) => {
    let serverReady = false;
    const appReadyInterval = setInterval(() => {
        checkAppReady((ready) => {
            if (!ready || serverReady) {
                return;
            }
            clearInterval(appReadyInterval);
            serverReady = true;
            cb();
        })
    });
}

// server log
function onServerLog(log) {
    console.log($.util.colors.white('[') +
        $.util.colors.yellow('nodemon') +
        $.util.colors.white(']') +
        log.message);
}

/********************
 * Tasks
 ********************/

gulp.task('inject', cb => $.runSequence(['inject:js', 'inject:scss'], cb));

gulp.task('inject:js', () => {
    return gulp.src(paths.client.indexView)
        .pipe($.inject(
            gulp.src(_.union([paths.client.scripts], ['!client/app/app.js']), { read: false })
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
            gulp.src(_.union([paths.client.styles], ['!' + paths.client.mainStyle]), { read: false })
            .pipe($.sort()), {
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
        .pipe(transpileClient())
        .pipe(gulp.dest('.tmp'));
});

gulp.task('es6:server', () => {
    return gulp.src(_.union([paths.server.scripts], [paths.server.json]))
        .pipe(transpileServer())
        .pipw(gulp.dest('dist/server'));
});

gulp.task('lint:scripts', cb => runSequence(['lint:scripts:client', 'lint:scripts:server'], cb));

gulp.task('lint:scripts:client', () => {
    return gulp.src(_.union([paths.client.scripts], _.map([paths.client.test], blob => '!' + blob)))
        .pipe(lintScriptClient());
});

gulp.task('lint:scripts:server', () => {
    return gulp.src(_.union([paths.server.scripts], _.map([paths.server.test], blob => '!' + blob)))
        .pipe(lintScriptServer());
});

gulp.task('lint:script:clientTest', => {
    return gulp.src(paths.client.test)
        .pipe(lintScriptClient());
});

gulp.task('lint:script:serverTest', => {
    return gulp.src(paths.server.test)
        .pipe(lintScriptServer());
});

gulp.task('clean', () => del(['.tmp/**/*'], { dot: true }));

gulp.task('start:client', cb => {
    whenServerReady(() => {
        open('http://localhost:' + config.port);
        cb();
    });
});

gulp.task('start:server:dev', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    config = require('./server/config/environment');
    nodemon('--watch server server')
        .on('log', onServerLog);
});

gulp.task('start:server:prod', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'production';
    config = require(`${paths.dist}/server/config/environment`);
   saf nodemon('--watch server server')
        .on('log', onserverLog);
});

gulp.task('wiredep:client', () => {
  return gulp.src(paths.client.mainView)
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

gulp.task('client:dist', () => del(['dist/!(.git*|.openshift|Procfile)**'], {dot: true}));

/********************
 * Watch
 ********************/

gulp.task('watch', () => {
    $.liverload.listen();

    $.watch(paths.client.styles, () => {
      gulp.src(paths.client.mainStyle)
        .pipe($.plumber())
        .pipe(styles())
        .pipe(gulp.dest('.tmp/app'))
        .pipe($.liverload());
    });

    $.watch(paths.client.views)
      .pipe($.plumber())
      .pipe($.liverload());

    $.watch(paths.client.scripts)
      .pipe($.plumber())
      .pipe(transpileClient())
      .pipe(gulp.dest('.tmp'))
      .pipe($.liverload());

    $.watch(_.union(paths.server.srcripts, paths.client.test, paths.server.test.unit, paths.server.test.intergration))
      .pipe($.plumber())
      .pipe(lintScriptServer())
      .pipe($.liverload());

    $.watch('bower.json', ['wiredep:client']);
});

/********************
 * Server
 ********************/

/********************
 * Build
 ********************/

 gulp.task('html', () => {
  return gulp.src('client/{app,components}/**/*.html')
    .pipe($.angularTemplatecache({
      module: 'richardApp'
    }))
    .pipe(gulp.dest('.tmp'));
 });

 gulp.task('constent', () => {
 });
