const chalk = require('chalk');

class LoggingHandler {
    constructor(bot = null) {
        if (bot) {
            this.bot = bot;
            this.injectLogger();
        }
    }

    injectLogger() {
        this.bot.debug = this.debug;
        this.bot.log = this.log;
        this.bot.error = this.error;
    }

    debug(output) {
        try {
            if (this.config.debug === true) {
                return console.log(`${chalk.yellow('[D]')} ${output}`);
            }
        } catch (error) {
            return;
        }
    }

    log(output) {
        return console.log(`${chalk.blue('[-]')} ${output}`);
    }

    error(output) {
        return console.error(`${chalk.red('[E]')} ${output}`);
    }
}

module.exports = LoggingHandler;
