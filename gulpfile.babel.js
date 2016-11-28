'use strict';

import fs from 'fs';

fs.readdirSync('./server/config/gulp').filter(file => {
  return (/\.(js|ts)$/i).test(file);
}).map(file => {
  require('./server/config/gulp/' + file);
});
