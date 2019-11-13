// TODO: Use real logger library

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

function debug(...output) {
    if (config.debug === true) {
        for (let i = 0; i < output.length; i++)
            console.log(`${chalk.yellow('[D]')} ${output[i]}`);
    }
}

function error(...output) {
    if (config.error === true) {
        for (let i = 0; i < output.length; i++)
            console.error(`${chalk.red('[E]')} ${output[i]}`);
    }
}

function log(...output) {
    if (config.log === true) {
        for (let i = 0; i < output.length; i++)
            console.log(`${chalk.blue('[-]')} ${output[i]}`);
    }
}

module.exports = {
    init,
    config,
    debug,
    error,
    log
};
