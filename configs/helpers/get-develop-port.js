const config = require('./get-develop-config')();

// Collect dev server port from differnts variants of configurations
const ENV_PORT = process.env.PORT;
const CONFIG_PORT = config ? config.PORT : null;
const DEFAULT_PORT = 9000;

module.exports = () => ENV_PORT || CONFIG_PORT || DEFAULT_PORT
