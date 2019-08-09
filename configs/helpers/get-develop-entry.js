const root = require('./root.js');
const packageConfig = require(root(['package.json']));

const getDevelopEntry = (appEntryFile = '') => {
  const entry = [];

  // If building React application
  if(
    packageConfig
    && packageConfig.dependencies
    && packageConfig.dependencies['react-hot-loader']
  ) {
    entry.push('react-hot-loader/patch');
  }

  entry.push(
    appEntryFile
      ? appEntryFile
      : root(['src', 'index']),
  );

  return entry;
}

module.exports = getDevelopEntry;
