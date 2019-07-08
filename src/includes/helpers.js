const Fuse = require('fuse.js');
const logger = require('./logger');
const { resolveColor } = require('discord.js/src/client/ClientDataResolver');
const { FLAGS } = require('discord.js').Permissions;

// TODO: alwaysId() - if not already an id, get object's id.

exports.expectId = function (obj) {
    if (typeof obj === 'object') {
        return obj.id;
    } else {
        return obj;
    }
};

exports.send = async function (channel, msg) {
    channel.send(msg).catch(error => {
        logger.error(`There was an error posting msg: ${error}`);
    });
};

exports.hexColor = function (hex) {
    if (!(typeof hex === 'number')) {
        return parseInt(hex, 16);
    } else {
        return hex;
    }
};

exports.rgbColor = function (red, green, blue) {
    return (red << 16) + (green << 8) + blue;
};

exports.userColor = function (userId, guild) {
    if (typeof userId === 'object') {
        userId = userId.id;
    }

    if (guild) {
        return guild.members.get(userId).displayColor;
    } else {
        return resolveColor('C27C0E');
    }
};

exports.resolveColor = resolveColor;

exports.findExactRole = function (guild, roleText) {
    // Override "everyone" to "@everyone" for a match
    if (roleText === 'everyone') {
        roleText = '@everyone';
    }

    let role = guild.roles.find(role => {
        if (role.name === roleText) return true;
        if (role.id === roleText) return true;
        return false;
    });

    return role;
};

exports.findRole = function (guild, roleText) {
    const options = {
        shouldSort: true,
        threshhold: 0.3, // between 0 (perfect) to 1 (complete mismatch)
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

    const fuse = new Fuse(Array.from(guild.roles.values()), options);
    const results = fuse.search(roleText);
    return results[0];
};

exports.findUser = function (guild, userText) {
    const options = {
        shouldSort: true,
        threshhold: 0.3, // between 0 (perfect) to 1 (complete mismatch)
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

    const fuse = new Fuse(Array.from(guild.members.values()), options);
    const results = fuse.search(userText);
    return results[0];
};

// Extend flags to include NOONE
exports.EXTENDED_FLAGS = { ...FLAGS, ...{ 'NOONE': '' } };
