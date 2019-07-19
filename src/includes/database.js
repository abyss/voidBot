const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const path = require('path');
const logger = require('../includes/logger');
const { resolveId } = require('./helpers');

// A lot of efficiency can be gained here by caching the database
// handlers instead of reopening on every db operation

let dataFolder;

const init = (folder) => {
    dataFolder = folder;
};

const dbHandle = (guild) => {
    if (!(typeof guild === 'string')) { throw new Error('dbHandle must be passed a string!'); }
    const jsonFile = path.resolve(dataFolder, `${guild}.json`);
    const adapter = new FileAsync(jsonFile);
    return low(adapter);
};

const get = async (guild, key) => {
    try {
        guild = resolveId(guild);
        if (!guild) throw new Error('invalid guild passed to db.get');

        const db = await dbHandle(guild);
        return await db.get(key).value();
    } catch (err) {
        logger.error('LowDB Error:', err);
    }
};

const set = async (guild, key, data) => {
    try {
        guild = resolveId(guild);
        if (!guild) throw new Error('invalid guild passed to db.set');

        const db = await dbHandle(guild);
        return await db.set(key, data).write();
    } catch (err) {
        logger.error('LowDB Error:', err);
    }
};

const del = async (guild, key) => {
    try {
        guild = resolveId(guild);
        if (!guild) throw new Error('invalid guild passed to db.del');

        const db = await dbHandle(guild);
        return await db.unset(key).write();
    } catch (err) {
        logger.error('LowDB Error:', err);
    }
};

module.exports = {
    init,
    get,
    set,
    delete: del
};
