'use strict';

// Development specific configuration
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/lala-dev',
  },

  // Seed database on startup
  seedDB: true,
};
