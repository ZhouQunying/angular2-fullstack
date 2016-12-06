import path from 'path';
import errors from './shared/errors';
import home from './api/home';

export default (app) => {
  // Insert routes below
  app.use('/app/home', home);

  // All undefinded asset or api routes should return 404
  app.route('/:url(api|auth|shared|app|assets)/*')
    .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(path.join(app.get('clientPath'), '/index.html')));
    });
};
