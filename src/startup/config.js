require('dotenv').config();
const logger = require('../includes/logger');
const config = require('../includes/config');

if (!process.env.TOKEN || !/^[A-Za-z0-9._-]+$/.test(process.env.TOKEN)) {
    logger.error('Environment variable TOKEN is missing or incorrect.');
    process.exit(1);
}

module.exports = config;
