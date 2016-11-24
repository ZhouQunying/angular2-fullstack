import path from 'path';

const _root = path.resolve(__dirname, '../..');

exports.root = (...paths) => {
  const args = Array.prototype.slice.call(paths, 0);

  return path.join.apply(path, [_root].concat(args));
}
