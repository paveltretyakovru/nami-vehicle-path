const getDevelopPort = require('../helpers/get-develop-port');
const getDevelopHost = require('../helpers/get-develop-host');
const getDevelopEntry = require('../helpers/get-develop-entry');

getDevelopEntry();

module.exports = {
  mode: 'development',

  entry: getDevelopEntry(),

  devServer: {
    hot: true,
    host: getDevelopHost(), 
    port: getDevelopPort(), 
  },
};
