const fs = require('fs');
const root = require('./root');

const developConfigFile = root(['configs', 'dev.json']);

const getDevelopConfig = () => {
  if (fs.existsSync(developConfigFile)) {
    return require(developConfigFile);
  }

  return null; 
}

module.exports = getDevelopConfig;
