const { resolveColor } = require('discord.js/src/client/ClientDataResolver');

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
