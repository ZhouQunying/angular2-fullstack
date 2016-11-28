'use strict';

import express from 'express';
import path from 'path';
import compression from 'compression';
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

export default app => {
  const env = app.get('env');

  app.set('views', path.join(config.root, 'server/views'));
  app.set('view engine', 'html');
  app.use(compression());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(session({
    secret: config.secrets.session,
    saveUninitialized: true,
    resave: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      db: 'lala',
    }),
  }));
  app.set('clientPath', path.join(config.root, 'client'));
  app.use(express.static(app.get('clientPath')));

  if (env !== 'test') {
    app.use(lusca({
      csrf: {
        angular: true,
      },
      xframe: 'SAMEORIGIN',
      hsts: {
        // 1 year, in seconds
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      xssProtection: true,
    }));
  }

  if (env === 'production') {
    app.use(favicon(path.join(app.get('clientPath'), 'favicon.ico')));
    app.use(morgan('dev'));
  }

  if (env === 'development') {
    app.use(require('connect-livereload')());
  }

  if (env === 'development' || env === 'test') {
    app.use(morgan('dev'));
    app.use(errorHandler());
  }
};
