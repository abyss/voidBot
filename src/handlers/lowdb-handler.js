const low = require('lowdb');
const DBInterface = require('./db-interface');
const fileAsync = require('lowdb/lib/storages/file-async');
const path = require('path');

class LowDBHandler extends DBInterface {
    constructor(bot, folder) {
        super(bot);
        this.dataFolder = folder;
        //TODO: this.guildCache = Map();
    }

    getDBHandle(guild) {
        if (!(typeof guild === 'string')) { throw 'dbHandle must be passed a string!'; }
        const jsonFile = path.resolve(this.dataFolder, guild);

        return low(
            `${jsonFile}.json`,
            { storage: fileAsync }
        );
    }

    async get(guild, key) {
        try {
            const db = this.getDBHandle(guild);
            return await db.get(key).value();
        } catch (error) {
            throw `LowDBHandler Get Error: ${error}`;
        }
    }

    async set(guild, key, data) {
        try {
            const db = this.getDBHandle(guild);
            await db.set(key, data).write();
        } catch (error) {
            throw `LowDBHandler Set Error: ${error}`;
        }
    }

    async delete(guild, key) {
        try {
            const db = this.getDBHandle(guild);
            db.unset(key).write();
        } catch (error) {
            throw `LowDBHandler Delete Error: ${error}`;
        }
    }

}

module.exports = LowDBHandler;
