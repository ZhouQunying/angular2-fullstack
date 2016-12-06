import fs from 'fs';

fs.readdirSync('./config/gulp')
  .filter(file => (/\.(js|ts)$/i).test(file))
  .map(file => require(`./config/gulp/${file}`));
