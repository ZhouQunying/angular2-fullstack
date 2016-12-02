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
      active: true,
    });
  });
