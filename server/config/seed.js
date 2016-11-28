/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */
'use strict';

import Thing from '../api/thing/thing.model';

Thing.find({})
  .remove()
  .then(() => {
    Thing.create({
      name: 'CC',
      info: 'Pretty girl.',
    }, {
      name: 'Frank',
      info: 'Smart boy.',
    });
  });
