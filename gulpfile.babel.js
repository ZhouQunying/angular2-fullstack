'use strict';

import fs from 'fs';

fs.readdirSync('./gulp').filter(file => {
  return (/\.(js|ts)$/i).test(file);
}).map(file => {
  require('./gulp/' + file);
});
