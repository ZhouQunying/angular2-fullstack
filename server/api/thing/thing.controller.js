/**
* Get /api/things -> index
*/

'use strict';

import _ from 'lodash';
import Thing from './thing.model';

// Get list of Things
export function index(req, res) {
  return Thing.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

function respondWithResult(res, statusCode) {
  const statusCode = statusCode || 200;
  return function(entity) {
    res.status(statusCode).json(entity);
  }
}

function handleError(res, statusCode) {
  const statusCode = statusCode || 500;
  return function(entity) {
    res.status(statusCode).send(err);
  }
}
