const logger = require('../includes/logger');

module.exports = (bot) => {
    logger.init({ debug: bot.config.debug });
    bot.log = logger.log;
    bot.error = logger.error;
    bot.debug = logger.debug;
    return logger;
};
