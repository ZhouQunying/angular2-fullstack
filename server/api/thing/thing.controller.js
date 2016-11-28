'use strict';

import Thing from './thing.model';

function respondWithResult(res, statusCode) {
  const code = statusCode || 200;

  return entity => {
    res.status(code).json(entity);
  };
}

function handleError(res, statusCode) {
  const code = statusCode || 500;

  return err => {
    res.status(code).send(err);
  };
}

export const index = (req, res) => {
  return Thing.find()
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
};
