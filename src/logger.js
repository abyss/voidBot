// TODO: Use real logger library
// TODO: properly handle NODE_ENV (production, development, test)

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

    // When testing, I only want to see errors
    if (process.env.NODE_ENV === 'test') {
        config.log = false;
        config.debug = false;
        config.error = true;
    }
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
