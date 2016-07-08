const paths = {
  client: {
    indexHtml: 'client/index.html',
    html: 'client/{app|components}/**/*.html',
    mainStyle: 'client/app/app.scss',
    styles: 'client/{app,components}/**/*.scss',
    scripts: 'client/**/*.js',
    images: 'client/assets/images/**/*',
    assets: 'client/assets/**/*'
  },
  server: {
    scripts: [
      'server/**/*.js',
      '!server/config/local.env.sample.js'
    ]
  }
};

export default paths;
