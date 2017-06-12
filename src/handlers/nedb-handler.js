const DBInterface = require('./db-interface');
const path        = require('path');
const assert      = require('assert');
const database    = require('nedb');
const discordjs   = require('discord.js');

// decent introduction here http://stackabuse.com/nedb-a-lightweight-javascript-database/
// I think a real MongoDB solution would be overkill
class NeDBHandler extends DBInterface {
    constructor(bot, folder) {
        super(bot);
        this.folder = folder;
        // This could have all be done in just one database file but I kept it seperated because that is what I think you did with your db
        // also it makes it more human readable and gives access to the servernames mapped to their ids (could store more ofc)... so that's a plus
        // load guild database that lists all the guilds that have a database - could also change that to just load all files in the guilds folder
        this.guilds = new database(({filename: path.resolve(folder, 'guilds.json'), autoload: true}));
        this.user   = new database(({filename: path.resolve(folder, 'users.json'), autoload: true}));
        // load all guild databases - this could be optimized to only load a guild in when they are required... and not in the constructor...
        let db      = new Map();
        this.guilds.find({}, function (err, guilds) {
            guilds.map(guild => {
                db.set(guild.id, new database(({filename: path.resolve(folder, 'guilds', guild.id + '.json'), autoload: true})));
            });
        });
        this.db = db;
    }

    getDBHandle(guild) {
        if (!(guild instanceof discordjs.Guild)) { throw 'dbHandle must be passed a guild!'; }
        let guild_db = this.db.get(guild.id);
        if (!guild_db) { // if guild doesn't has a database already create one, add the server and return the db of the guild
            guild_db = new database(({filename: path.resolve(this.folder, 'guilds', guild.id + '.json'), autoload: true}));
            this.db.set(guild.id, guild_db);
            this.guilds.insert({id: guild.id, name: guild.name,});
        }
        return guild_db;
    }

    /**
     * Get a value for a key for a database
     * @param guild
     * @param key
     * @returns {Promise} resolves into the value or null
     */
    get(guild, key) {
        let db = this.getDBHandle(guild);
        return new Promise(res => {
            db.findOne({key: key}, (err, doc) => {
                if (err) {
                    // errorhandling?
                    return res(false);
                }
                if (doc) {
                    return res(doc.data);
                }
                else {
                    return res(doc);
                }
            });
        });
    }

    /**
     * Sets a value -> Inserts if not already in database updates otherwise
     * @param guild
     * @param key
     * @param data
     * @returns {Promise} resolves into the added {object}(database)object or {number}amount of updated values
     */
    async set(guild, key, data) {
        let old_value = await this.get(guild, key);
        return new Promise(res => {
            if (old_value) {
                return res(this.update(guild, {key: key}, {$set: {data: data}}));
            }
            else {
                return res(this.insert(guild, key, data));
            }
        });
    }

    /**
     * Update data in a database
     * @param guild
     * @param query
     * @param substitution
     * @returns {Promise} resolves in {number}amount of updates
     */
    update(guild, query, substitution) {
        let db = this.getDBHandle(guild);
        return new Promise(res => {
            db.update(query, substitution, function (err, callback) {
                if (err) {
                    // errorhandling?
                    return res(false);
                }
                return res(callback);
            });
        });
    }

    /**
     * Add data to a database
     * @param guild
     * @param key
     * @param data
     * @returns {Promise} resolves in {number}amount of inserts
     */
    insert(guild, key, data) {
        let db = this.getDBHandle(guild);
        return new Promise(res => {
            db.insert({key, data}, function (err, callback) {
                if (err) {
                    // errorhandling?
                    return res(false);
                }
                return res(callback);
            });
        });
    }

    // untested
    delete(guild, key) {
        let db = this.getDBHandle(guild);
        return new Promis(res => {
            db.remove({key, data}, function (err, callback) {
                if (err) {
                    // errohandling?
                    return res(false);
                }
                return res(callback);
            });
        });
    }

    /**
     * Get one whole database object
     * @param guild
     * @param query
     * @returns {Promise} resolves into the {object}object or null
     */
    getObj(guild, query) {
        let db = this.getDBHandle(guild);
        return new Promise(res => {
            db.findOne(query, (err, doc) => {
                return res(doc);
            });
        });
    }

}

module.exports = NeDBHandler;



