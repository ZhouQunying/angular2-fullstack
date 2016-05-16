'use strict';

import gulp from 'gulp';
import _ from 'lodash';
import gulpLoadPlugins from 'gulp-load-plugins';
import lazypipe from 'lazypipe';
import nodemon from 'nodemon';
import open from 'open';
import runSequence from 'run-sequence';
import { stream as wiredep } from 'wiredep';
import { Instrumenter } from 'isparta';
import { protractor, webdriver_update } from 'gulp-protractor';

const paths = {
  client: {
    indexHtml: 'client/index.html',
    html: 'client/{app|components}/**/*.html',
    mainStyle: 'client/app/app.scss',
    styles: 'client/{app,components}/**/*.scss',
    scripts: 'client/**/!(*.spec|*.mock).js',
    test: 'client/{app,components}/**/*.{spec,mock}.js',
    images: 'client/assets/images/**/*',
    asstes: 'client/asstes/**/*'
  },
  server: {
    scripts: [
      'server/**/!(*.spec|*.intergration).js',
      '!server/config/local.env.sample.js'
    ],
    test: {
      intergration: ['server/**/*.intergration.js', 'mocha.global.js'],
      unit: ['server/**/*.spec.js', 'mocha.global.js']
    },
    json: 'server/**/*.json'
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
  // .pipe($.bable, {
  //   plugins: [
  //     'transform-class-properties',
  //     'transform-runtime'
  //   ]
  // })
  .pipe($.sourcemaps.write, '.');

let lintScriptClient = lazypipe()
  .pipe(() => {
    return $.eslint({ 'useEslintrc': true });
  })
  .pipe(() => {
    return $.eslint.format();
  })
  .pipe(() => {
    $.eslint.failAfterError();
  });

let lintScriptServer = lazypipe()
  .pipe(() => {
    return $.eslint({ 'useEslintrc': true });
  })
  .pipe(() => {
    return $.eslint.format();
  })
  .pipe(() => {
    $.eslint.failAfterError();
  });

let mocha = lazypipe()
  // .pipe($.mocha, {
  //   reporter: 'spec',
  //   timeout: 5000,
  //   require: [
  //     './mocha.conf'
  //   ]
  // });

let istanbul = lazypipe()
  .pipe($.istanbul.writeReports)
  // .pipe($.istanbulEnforcer, {
  //   thresholds: {
  //     global: {
  //       lines: 80,
  //       statements: 80,
  //       branches: 80,
  //       functions: 80
  //     }
  //   },
  //   coverageDirectory: './coverage',
  //   rootDirectory: ''
  // });

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
function whenServerReady(cb) {
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
 * Env
 ********************/

gulp.task('env:all', () => {
  let localConfig;
  try {
    localConfig = require('./server/config/local.env');
  } catch (e) {
    localConfig = {};
  }
  $.env({
    vars: localConfig
  });
});

gulp.task('env:test', () => {
  $.env({
    vars: { NODE_ENV: 'test' }
  });
});

gulp.task('env:prod', () => {
  $.env({
    vars: { NODE_ENV: 'production' }
  });
});

/********************
 * Tasks
 ********************/

gulp.task('inject', cb => $.runSequence(['inject:js', 'inject:scss'], cb));

gulp.task('inject:js', () => {
  return gulp.src(paths.client.indexHtml)
    .pipe($.inject(
      gulp.src(_.union([paths.client.scripts], ['!client/app/app.js']), { read: false })
      .pipe($.sort(sortModulesTop))
    ))
    .pipe(gulp.dest('client'));
});

// gulp.task('inject:css', () => {
//   return gulp.src(paths.client.indexHtml)
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

gulp.task('transpile:client', () => {
  return gulp.src(paths.client.scripts)
    .pipe(transpileClient())
    .pipe(gulp.dest('.tmp'));
});

gulp.task('transpile:server', () => {
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

gulp.task('lint:script:clientTest', () => {
  return gulp.src(paths.client.test)
    .pipe(lintScriptClient());
});

gulp.task('lint:script:serverTest', () => {
  return gulp.src(paths.server.test)
    .pipe(lintScriptServer());
});

gulp.task('clean', () => del(['.tmp/**/*'], { dot: true }));

gulp.task('wiredep:client', () => {
  return gulp.src(paths.client.mainHtml)
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

gulp.task('clean:tmp', () => del(['.tmp/**/*'], { dot: true }));

gulp.task('clean:dist', () => del(['dist/!(.git*|.openshift|Procfile)**'], { dot: true }));

/********************
 * Server
 ********************/

gulp.task('start:client', cb => {
  whenServerReady(() => {
    open('http://localhost:' + config.port);
    cb();
  });
});

gulp.task('start:server', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  config = require('./server/config/environment');
  nodemon('--watch server server')
    .on('log', onServerLog);
});

gulp.task('start:server:prod', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'production';
  config = require(`./dist/server/config/environment`);
  nodemon('--watch server server')
    .on('log', onserverLog);
});

gulp.task('serve', cb => {
  runSequence(
    ['clean:tmp', 'constant'],
    'wiredep:client', ['transpile:client', 'styles'], ['start:server', 'start:client'],
    'watch',
    cb
  );
});

gulp.task('serve:dist', () => {
  runSequence(
    'build',
    'env:all',
    'env:prod', ['start:server:prod', 'start:client'],
    cb
  );
});

gulp.task('test:client', ['wiredep:test', 'constant'], cb => {
  new KarmaServer({
    configFile: `${__dirname}/${paths.karma}`,
    singleRun: true
  }, cb).start();
});

gulp.task('test:server', cb => {
  runSequence(
    'env:all',
    'env:test',
    'mocha:unit',
    'mocha:integration',
    'mocha:coverage',
    cb
  );
});

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

  $.watch(paths.client.html)
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
 * Build
 ********************/

gulp.task('build', cb => {
  runSequence(
    [
      'clean:dist',
      'clean:tmp'
    ],
    'inject',
    'wiredep:client', [
      'build:images',
      'copy:extras',
      'copy:fonts',
      'copy:assets',
      'copy:server',
      'transpile:server',
      'build:client'
    ],
    cb
  );
});

gulp.task('html', () => {
  return gulp.src('client/{app,components}/**/*.html')
    .pipe($.angularTemplatecache({
      module: 'richardApp'
    }))
    .pipe(gulp.dest('.tmp'));
});

gulp.task('constant', () => {
  let sharedConfig = require('./server/config/enviroment/shared');

  return $.ngConstant({
    name: 'richardApp.constants',
    deps: [],
    wrap: true,
    stream: true,
    constants: { appConfig: sharedConfig }
  })
    .pipe($.rename({
      basename: 'app.constant'
    }))
    .pipe(gulp.dest('client/app/'));
});

gulp.task('build:images', () => {
  return gulp.src(paths.client.images)
    .pipe($.imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true
    }))
    .pipe($.rev())
    .pipe(gulp.dest('dist/client/assets/images'))
    .pipe($.rev.manifest('dist/client/assets/rev-manifest.json', {
      base: 'dist/client/assets',
      merge: true
    }))
    .pipe(gulp.dest('dist/client/assets'));
});

gulp.task('copy:extras', () => {
  return gulp.src([
    'client/favicon.ico',
    'client/robots.txt',
    'client/.htaccess'
  ], { dot: true })
    .pipe(gulp.dest('dist/client'));
});

gulp.task('copy:assets', () => {
  return gulp.src([paths.client.assets, `!${paths.client.images}`])
    .pipe(gulp.dest('dist/client/asstes'));
});

gulp.task('copy:server', () => {
  return gulp.src([
    'package.json',
    'bower.json',
    '.bowerrc'
  ], { cwdbase: true })
    .pipe(gulp.dest('dist'));
});

/********************
 * Test
 ********************/

gulp.task('mocha:unit', () => {
  return gulp.src(paths.server.test.unit)
    .pipe(mocha());
});

gulp.task('mocha:integration', () => {
  return gulp.src(paths.server.test.integration)
    .pipe(mocha());
});

gulp.task('coverage:pre', () => {
  return gulp.src(paths.server.scripts)
    .pipe($.istanbul({
      instrumenter: Instrumenter,
      includeUntested: true
    }))
    .pipe($.istanbul.hookRequire());
});

gulp.task('coverage:unit', () => {
  return gulp.src(paths.server.test.unit)
    .pipe(mocha())
    .pipe(istanbul())
});

gulp.task('coverage:integration', () => {
  return gulp.src(paths.server.test.integration)
    .pipe(mocha())
    .pipe(istanbul())
});

gulp.task('mocha:coverage', cb => {
  runSequence(
    'coverage:pre',
    'env:all',
    'env:test',
    'coverage:unit',
    'coverage:integration',
    cb
  );
});

// Downloads the selenium webdriver
gulp.task('webdriver_update', webdriver_update);

gulp.task('test:e2e', ['env:all', 'env:test', 'start:server', 'webdriver_update'], cb => {
  gulp.src('e2e/**/*.spec.js')
    .pipe(protractor({
      configFile: 'protractor.conf.js'
    })).on('error', err => {
      console.log(err)
    }).on('end', () => {
      process.exit();
    });
});
