const logger = require('../logger');
const { getGuildPrefix, userColor } = require('./discord');
const bot = require('../bot');

async function send(channel, ...msg) {
    await channel.send(...msg).catch(error => {
        logger.error(`There was an error posting msg: ${error}`);
    });
}

exports.send = send;

exports.sendCommandHelp = async function (channel, command) {
    const color = userColor(bot.client.user.id, channel.guild);
    const prefix = await getGuildPrefix(channel.guild);
    const embedFields = [];

    let description;

    if (command.usage.size === 0) {
        description = '';
        embedFields.push({
            name: `${prefix}${command.config.cmd}`,
            value: command.config.description
        });
    } else {
        description = command.config.description;
        command.usage.forEach((value, key) => {
            embedFields.push({
                name: `${prefix}${command.config.cmd} ${key}`,
                value: value
            });
        });
    }

    const embed = {
        author: {
            name: 'voidBot Help Command',
            icon_url: bot.client.user.avatarURL(),
        },
        color: color,
        title: command.config.name,
        description: description,
        fields: embedFields
    };

    return send(channel, { embed: embed });
};
