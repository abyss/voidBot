const bot = require('../bot');
const { resolveId } = require('../utils/discord');
const { send } = require('../utils/discord');
const { getCommand } = require('./command-loader');
const { checkDebug, hasPermission } = require('./permissions');

async function getGuildPrefix(guild) {
    if (!guild) { return ''; }

    const id = resolveId(guild);
    const prefix = await bot.db.get(id, 'prefix');
    if (prefix) {
        return prefix;
    }

    return bot.config.prefix;
}

function validLocation(message, command) {
    const type = message.channel.type;
    const loc = command.config.location;

    if (loc === 'ALL') { return true; }

    if (type === 'text' && loc === 'GUILD_ONLY') {
        return true;
    }

    if (type === 'dm' && loc === 'DM_ONLY') {
        return true;
    }

    return false;
}

async function onMessage(message) {
    const processedCommand = await processMessage(message);

    // not a command
    if (!processedCommand) return;

    const command = getCommand(processedCommand.base);
    if (!command) { return; }

    if (!validLocation(message, command)) { return; }

    if (!checkDebug(message, command)) { return; }

    if (message.channel.type === 'text') {
        if (!await hasPermission(message.guild, message.member, command)) {
            return;
        }
    }

    const success = await command
        .run(message, processedCommand.args)
        .catch(error => {
            send(message.channel, `**:interrobang:  |  An error has occured:** ${error}`);
            bot.error(`Command error in ${command.id}: ${error}`);
        });

    // TODO: Re-enable when sendCommandHelp finished
    // Only print help if command returns explicit false, not undefined.
    // if (success === false) {
    //     sendCommandHelp(message.channel, command);
    // }
}

async function processMessage(message) {
    const cmdDetails = {
        base: '',
        args: []
    };


    if (message.channel.type === 'dm' || message.channel.type === 'group') {
        const split = message.content.trim().split(/ +/);
        cmdDetails.base = split[0];
        cmdDetails.args = split.slice(1);
        return cmdDetails;
    }

    // If it's not a dm, and it's not a text channel, we're done here.
    if (message.channel.type !== 'text') {
        return;
    }

    const prefix = await getGuildPrefix(message.guild);

    if (message.content.startsWith(prefix)) {
        const split = message.content.substr(prefix.length).trim().split(/ +/);
        cmdDetails.base = split[0];
        cmdDetails.args = split.slice(1);
        return cmdDetails;
    }

    const regexTag = new RegExp(`^<@!?${bot.client.user.id}> `);
    if (regexTag.test(message.content)) {
        const split = message.content.trim().split(/ +/);
        cmdDetails.base = split[1];
        cmdDetails.args = split.slice(2);
        return cmdDetails;
    }

    // Not a command
    return;
}

module.exports = {
    getGuildPrefix,
    validLocation,
    onMessage
};
