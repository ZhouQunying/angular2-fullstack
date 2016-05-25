/**
* Get /api/things -> index
*/

'use strict';

import _ from 'lodash';
import Thing from './thing.model';

// Get list of Things
export const index = (req, res) => {
  return Thing.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

function respondWithResult(res, statusCode) {
  const code = statusCode || 200;
  return function(entity) {
    res.status(code).json(entity);
  }
}

function handleError(res, statusCode) {
  const code = statusCode || 500;
  return function(entity) {
    res.status(code).send(err);
  }
}
