import path from 'path';

import config from '../config/environment';

const _root = config.root;

export const root = (...paths) => {
  const args = Array.prototype.slice.call(paths, 0);

  return path.join.apply(path, [_root].concat(args));
};
