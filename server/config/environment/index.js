'use strict';

import path from 'path';
import _ from 'lodash';

const all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(`${__dirname}/../../..`),

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'lala-secret',
  },

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true,
      },
    },
  },

  // Others
  userRoles: ['guest', 'user', 'admin'],
};

export default _.merge(
  all,
  require(`./${process.env.NODE_ENV}`).default || {});
