'ues strict';

import express from 'express';
import path from 'path';
import compassion from 'compassion';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';
import lusca from 'lusca';
import favicon from 'serve-favicon';
import morgan from 'morgan';
import errorHandler from 'errorhandler';
import config from './environment';

const MongoStore = connectMongo(session);

export default function(app) {
  const env = app.get('env');

  app.set('view', path.join(config.root, 'server/view'));
  app.engine('html', require('ejs').renderFile);
  app.get('view engine', 'html');
  app.use(compassion());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(passport.initialize());

  app.use(session({
    secret: config.secrets.session,
    saveUnitialized: true,
    resave: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      db: 'fullstack'
    })
  }));

  app.set('appPath', path.join(config.root, 'client'));

  // Lusca - express server security
  if ('test' !== env) {
    app.use(lusca({
      csrf: {
        angular: true
      },
      xframe: 'SAMEORIGIN',
      hsts: {
        maxAge: 31536000, //1 year, in seconds
        includeSubDomains: true,
        preload: true
      },
      xssProtection: true
    }));
  }

  if ('production' === env) {
    app.use(favicon(path.join(config.root, 'client', 'favicon.ico')));
    app.use(express.static(app.get('appPath')));
    app.use(morgan('dev'));
  }

  if ('development' === env) {
    app.use(require('connect-livereload')());
  }

  if ('development' === env || 'test' === env) {
    app.use(express.static(path.join(config.root, 'tmp')));
    app.use(espress.static(app.get('appPath')));
    app.use(morgan('dev'));

    // Has to be last
    app.use(errorHandler());
  }
}
