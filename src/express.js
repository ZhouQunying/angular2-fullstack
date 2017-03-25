import path from 'path';
import compression from 'compression';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';
import consolidate from 'consolidate';
import lusca from 'lusca';
import morgan from 'morgan';
import errorHandler from 'errorhandler';
import connectLivereload from 'connect-livereload';

import config from './config/environment';

const MongoStore = connectMongo(session);

export default (app) => {
  const env = app.get('env');

  app.set('views', path.join(config.root, 'src/views'));
  app.engine('html', consolidate.mustache);
  app.set('view engine', 'html');
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
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
      db: 'sparkme',
    }),
  }));

  if (env !== 'test') {
    app.use(lusca({
      csrf: true,
      xframe: 'SAMEORIGIN',
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      xssProtection: true,
    }));
  }

  if (env === 'production') {
    app.use(morgan('dev'));
  }

  if (env === 'development') {
    app.use(connectLivereload());
  }

  if (env === 'development' || env === 'test') {
    app.use(morgan('dev'));
    app.use(errorHandler());
  }
};
