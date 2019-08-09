const root = require('./root.js');

const getDevelopEntry = (appEntryFile = '') => {
  const entry = [];

  // If building React application
  if(require.resolve('react')) {
    entry.push('react-host-loader/path');
  }

  entry.push(
    appEntryFile
      ? appEntryFile
      : root(['src', 'index.jsx']),
  );

  return entry;
}

module.exports = getDevelopEntry;
