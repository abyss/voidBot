require('dotenv').config();

const ConfigHandler = require('../includes/config-handler');

module.exports = function init() {
    return new ConfigHandler();
};
