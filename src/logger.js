// TODO: Use real logger library

const chalk = require('chalk');

// Sane defaults
const config = {
    error: true,
    log: true,
    debug: false
};

function init() {
    const env = (process.env.NODE_ENV || 'development').toLowerCase();

    if (env === 'development') config.debug = true;
    if (env === 'test') config.log = false;
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
