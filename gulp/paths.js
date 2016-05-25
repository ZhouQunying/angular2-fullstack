const paths = {
  client: {
    indexHtml: 'client/index.html',
    html: 'client/{app|components}/**/*.html',
    mainStyle: 'client/app/app.scss',
    styles: 'client/{app,components}/**/*.scss',
    scripts: 'client/**/!(*.spec|*.mock).js',
    test: 'client/{app,components}/**/*.{spec,mock}.js',
    images: 'client/assets/images/**/*',
    assets: 'client/assets/**/*'
  },
  server: {
    scripts: [
      'server/**/!(*.spec|*.integration).js',
      '!server/config/local.env.sample.js'
    ],
    test: {
      intergration: ['server/**/*.intergration.js', 'mocha.global.js'],
      unit: ['server/**/*.spec.js', 'mocha.global.js']
    }
  }
};

export default paths;
