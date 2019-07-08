const logger = require('../includes/logger');

module.exports = function init(bot, config) {
    logger.init(config);
    bot.log = logger.log;
    bot.error = logger.error;
    bot.debug = logger.debug;
};
