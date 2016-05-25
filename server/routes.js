'use strict';

import path from 'path';
import errors from './components/errors';

export default function(app) {
  // Insert routes below
  app.use('/app/things', require('./api/thing'));

  // All undefinded asset or api routes should return 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(path.join(app.get('appPath'), 'index.html')));
    });
};
