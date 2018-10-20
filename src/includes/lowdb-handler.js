const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const DBInterface = require('./interfaces/db-interface');
const path = require('path');
const { expectId } = require('./helpers');

class LowDBHandler extends DBInterface {
    constructor(bot, folder) {
        super(bot);
        this.dataFolder = folder;
        //TODO: this.guildCache = Map();
    }

    getDBHandle(guild) {
        if (!(typeof guild === 'string')) { throw 'dbHandle must be passed a string!'; }
        const jsonFile = path.resolve(this.dataFolder, guild) + '.json';
        const adapter = new FileAsync(jsonFile);
        return low(adapter);
    }

    async get(guild, key) {
        try {
            guild = expectId(guild);
            const db = await this.getDBHandle(guild);
            return await db.get(key).value();
        } catch (error) {
            throw `LowDBHandler Get Error: ${error}`;
        }
    }

    async set(guild, key, data) {
        try {
            guild = expectId(guild);
            const db = await this.getDBHandle(guild);
            await db.set(key, data).write();
        } catch (error) {
            throw `LowDBHandler Set Error: ${error}`;
        }
    }

    async delete(guild, key) {
        try {
            guild = expectId(guild);
            const db = await this.getDBHandle(guild);
            db.unset(key).write();
        } catch (error) {
            throw `LowDBHandler Delete Error: ${error}`;
        }
    }

}

module.exports = LowDBHandler;
