'use strict';

import path from 'path';
import _ from 'lodash';

// All configurations will extend these options
let all = {
    env: process.env.NODE_ENV,

    // Root path of server
    root: path.normalize(__dirname + '/../../..'),

    // Server port
    port: process.env.PORT || 9000,

    // Server ip
    ip: process.env.IP || '0.0.0.0',

    // Populate the DB with sample date?
    seedDB: false,

    // Secret for session
    secrets: {
    	session: 'fullstack-secret'
    },

    // MongoDB connection option
    mongo: {
        options: {
            db: {
                safe: true
            }
        }
    }
};

// Export the config object based on the NODE_ENV
module.exports = _.merge(
    all,
    require('./shared'),
    require('./' + process.env.NODE_ENV + '.js') || {});
