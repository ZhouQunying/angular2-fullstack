'use strict';

// Test specific configuration
export default {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/fullstack-test'
  },
  sequelize: {
    uri: 'sqlite://',
    options: {
      logging: false,
      storage: 'test.sqlite',
      define: {
        timestamps: false
      }
    }
  }
};
