const Fuse = require('fuse.js');
const bot = require('../bot');
const { FLAGS } = require('discord.js').Permissions;

exports.resolveId = function (obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    if (typeof obj.id === 'string') return obj.id;

    return '';
};

exports.getGuildPrefix = async function (guild) {
    if (!guild) { return ''; }

    const prefix = await bot.db.get(guild, 'prefix');
    if (prefix) {
        return prefix;
    }

    return bot.config.prefix;
};

exports.findExactRole = function (guild, roleText) {
    // Override "everyone" to "@everyone" for a match
    if (roleText === 'everyone') {
        roleText = '@everyone';
    }

    let role = guild.roles.cache.find(role => {
        if (role.name === roleText) return true;
        if (role.id === roleText) return true;
        return false;
    });

    return role;
};

exports.findRole = function (guild, roleText) {
    const options = {
        shouldSort: true,
        threshold: 0.6, // between 0 (perfect) to 1 (complete mismatch)
        location: 0,
        distance: 100,
        maxPatternLength: 20,
        minMatchCharLength: 1,
        keys: [
            'name',
            'id',
        ]
    };

    const tagged = roleText.match(/^<@&(\d{17,19})>$/);
    if (tagged) {
        roleText = tagged[1]; // First is the entire string, second is Id
    }

    const fuse = new Fuse(Array.from(guild.roles.cache.values()), options);
    const results = fuse.search(roleText);

    if (Array.isArray(results) && results[0]) return results[0].item;
    else return undefined;
};

exports.findMember = function (guild, userText) {
    const options = {
        shouldSort: true,
        threshold: 0.6, // between 0 (perfect) to 1 (complete mismatch)
        location: 0,
        distance: 100,
        maxPatternLength: 20,
        minMatchCharLength: 1,
        keys: [
            'displayName',
            'id',
            'user.tag'
        ]
    };

    const tagged = userText.match(/^<@!?(1|\d{17,19})>$/);
    if (tagged) {
        userText = tagged[1]; // First is the entire string, second is Id
    }

    const fuse = new Fuse(Array.from(guild.members.cache.values()), options);
    const results = fuse.search(userText);

    if (Array.isArray(results) && results[0]) return results[0].item;
    else return undefined;
};

exports.serverStats = async function (guild) {
    if (!guild.available) return;

    const stats = {
        id: guild.id,
        name: guild.name,
        owner: {
            id: guild.owner.user.id,
            tag: guild.owner.user.tag
        }
    };

    await bot.db.set(guild.id, '__metadata__', stats);
};

exports.cleanPermissions = async function (guild) {
    const permissions = await bot.db.get(guild, 'permissions');
    if (!permissions) return;
    for (let command of Object.keys(permissions)) {
        for (let roleId of Object.keys(permissions[command])) {
            const role = guild.roles.cache.get(roleId);
            if (!role) {
                bot.debug(`Deleting role ID: ${roleId} on ${guild.name}`);
                await bot.db.delete(
                    guild,
                    `permissions.${command}.${roleId}`
                );
            }
        }
    }
};

exports.serverUpkeep = async function(guild) {
    await exports.serverStats(guild);
    await exports.cleanPermissions(guild);
};

exports.allServerUpkeep = async function () {
    const guildUpkeeps = bot.client.guilds.cache.map(guild => exports.serverUpkeep(guild));
    await Promise.all(guildUpkeeps);
};

exports.userColor = function (user, guild) {
    const uid = exports.resolveId(user);

    if (guild) {
        return guild.members.cache.get(uid).displayColor;
    } else {
        return 'C27C0E';
    }
};

// Extend flags to include NOONE
exports.EXTENDED_FLAGS = { ...FLAGS, ...{ 'NOONE': '' } };
