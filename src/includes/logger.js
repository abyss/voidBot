const chalk = require('chalk');

const config = {
    error: true,
    log: true,
    debug: true
};

function init(conf) {
    if (typeof conf !== 'object') conf = {};

    if (conf.debug === false) config.debug = false;
    if (conf.error === false) config.error = false;
    if (conf.log === false) config.log = false;
}

function debug(output) {
    if (config.debug === true) {
        return console.log(`${chalk.yellow('[D]')} ${output}`);
    }
}

function error(output) {
    if (config.error === true) {
        return console.error(`${chalk.red('[E]')} ${output}`);
    }
}

function log(output) {
    if (config.log === true) {
        return console.log(`${chalk.blue('[-]')} ${output}`);
    }
}

module.exports = {
    init,
    config,
    debug,
    error,
    log
};
