import path from 'path';

import config from './config/environment';
import errors from './shared/errors';
import home from './api/home';

export default (app) => {
  // Insert routes below
  app.use('/home', home);

  // All undefinded asset or api routes should return 404
  app.route('/:url(api|auth|shared|app|assets)/*')
    .get(errors[404]);

  // All other routes
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(path.join(config.root, 'src/views/index.html')));
    });
};
