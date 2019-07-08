const logger = require('./logger');

class ConfigHandler {
    constructor() {
        this.owners = this.parseOwners();
        this.prefix = process.env.DEFAULTPREFIX || '/';
        this.debug = this.parseBoolean(process.env.DEBUG);
        this.version = process.env.npm_package_version;
        this._permissions = new Set(['SEND_MESSAGES', 'READ_MESSAGES']);

        this.validateToken();
    }

    validateToken() {
        if (!process.env.TOKEN || !/^[A-Za-z0-9._-]+$/.test(process.env.TOKEN)) {
            logger.error('Environment variable TOKEN is missing or incorrect.');
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

    parseBoolean(input) {
        if (typeof input === 'string') {
            input = input.toLowerCase();
            if (input === 'true') { return true; }
            if (input === '1') { return true; }
            if (input === 'yes') { return true; }
        }

        if (input) return true;
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
