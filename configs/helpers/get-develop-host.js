const config = require('./get-develop-config')();
const ENV_HOST = process.env.HOST;
const CONFIG_HOST = config ? config.HOST : null;
const DEFAULT_HOST = 'localhost';

module.exports = () => ENV_HOST || CONFIG_HOST || DEFAULT_HOST;
