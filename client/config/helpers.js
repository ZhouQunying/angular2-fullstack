import path from 'path';

const _root = path.resolve(__dirname, '../..');

function root() {
  const args = Array.prototype.slice.call(arguments, 0);

  return path.join.apply(path, [_root].concat(args));
}

export default root;
