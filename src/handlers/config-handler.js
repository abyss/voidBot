require('dotenv').config();
const chalk = require('chalk');

class ConfigHandler {
    constructor(bot) {
        this.owners = this.parseOwners();
        this.prefix = process.env.DEFAULTPREFIX || '/';
        this.debug = this.parseDebug();
        this.version = process.env.npm_package_version;
        this._permissions = new Set(['SEND_MESSAGES', 'READ_MESSAGES']);

        this.injectLogging(bot);
        this.validateToken();
    }

    //TODO: Logging Handler
    injectLogging(bot) {
        bot.debug = (output) => {
            if (this.debug === true) {
                return console.log(`${chalk.yellow('[D]')} ${output}`);
            }
        };

        bot.log = (output) => {
            return console.log(`${chalk.blue('[-]')} ${output}`);
        };

        bot.error = (output) => {
            return console.error(`${chalk.red('[E]')} ${output}`);
        };
    }

    validateToken() {
        if (!process.env.TOKEN || !/^[A-Za-z0-9\._\-]+$/.test(process.env.TOKEN)) {
            this.bot.error('Environment variable TOKEN is missing or incorrect.');
            process.exit(1);
        }
    }

    parseOwners() {
        const owners = process.env.OWNER.split(',');
        return owners;
    }

    isOwner(user) {
        if (!user) { return undefined; }

        let id;
        if (typeof user === 'string') {
            id = user;
        } else if (typeof user.id === 'string') {
            id = user.id;
        }

        return this.owners.includes(id);
    }

    parseDebug() {
        let debug = process.env.DEBUG;

        if (typeof debug === 'undefined') { return false; }
        debug = debug.toLowerCase();
        if (debug === 'true') { return true; }
        if (debug === '1') { return true; }
        if (debug === 'yes') { return true; }

        return false;
    }

    get permissions() {
        return [...this._permissions];
    }

    registerPermission(perm) {
        this._permissions.add(perm);
    }
}

module.exports = ConfigHandler;
