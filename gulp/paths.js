const paths = {
  client: {
    scripts: 'client/**/*.ts',
    assets: 'client/assets/**/*',
  },
  server: {
    scripts: [
      'server/**/*.js',
      '!server/config/local.env.sample.js',
    ]
  }
};

export default paths;
