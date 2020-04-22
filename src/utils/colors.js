const { resolveColor } = require('discord.js/src/client/ClientDataResolver');
const { resolveId } = require('./discord');

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

exports.userColor = function (user, guild) {
    const uid = resolveId(user);

    if (guild) {
        return guild.members.get(uid).displayColor;
    } else {
        return resolveColor('C27C0E');
    }
};

exports.randomColor = function() {
    return [
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256)
    ];
};

exports.resolveColor = resolveColor;
