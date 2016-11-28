/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */
'use strict';

import Home from '../api/home/home.model';

Home.find({})
  .remove()
  .then(() => {
    Home.create({
      name: 'CC',
      info: 'Pretty girl.',
    }, {
      name: 'Frank',
      info: 'Smart boy.',
    });
  });
