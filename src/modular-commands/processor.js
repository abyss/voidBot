const bot = require('../bot');
const { getGuildPrefix } = require('../utils/discord');
const { send, commandHelp } = require('../utils/chat');
const { getCommand } = require('./hashmap');
const { checkDebug, hasPermission } = require('./permissions');

function validLocation(type, command) {
    const loc = command.config.location;

    if (loc === 'ALL') return true;
    if (type === 'text' && loc === 'GUILD_ONLY') return true;
    if (type === 'dm' && loc === 'DM_ONLY') return true;
    return false;
}

async function processor(message) {
    const commandStructure = await commandAttemptCheck(message);

    // not a command attempt
    if (!commandStructure) return;

    const command = getCommand(commandStructure.base);
    if (!command) { return; }

    if (!validLocation(message.channel.type, command)) { return; }

    if (!checkDebug(message.author, command)) { return; }

    if (message.channel.type === 'text') {
        if (!await hasPermission(message.guild, message.member, command)) {
            return;
        }
    }

    const success = await command
        .run(message, commandStructure.args)
        .catch(error => {
            send(message.channel, `**:interrobang:  |  An error has occured:** ${error}`);
            bot.error(`Command error in ${command.id}: ${error}`);
        });

    // Only print help if command returns explicit false, not undefined.
    if (success === false) {
        const help = commandHelp(command);
        send(message.channel, help);
    }
}

async function commandAttemptCheck(message) {
    // TODO: abstract this to DRY? (don't repeat yourself)
    const cmdDetails = {
        base: '',
        args: []
    };

    if (message.channel.type === 'dm' || message.channel.type === 'group') {
        // for direct messages, first word is base, rest is arguments, no prefix
        const split = message.content.trim().split(/ +/);
        cmdDetails.base = split[0];
        cmdDetails.args = split.slice(1);
        return cmdDetails;
    }

    // If it's not a dm, and it's not a text channel, we don't care about it
    if (message.channel.type !== 'text') {
        return;
    }

    const prefix = await getGuildPrefix(message.guild);

    if (message.content.startsWith(prefix)) {
        // crop the prefix. first word is base, rest is arguments
        const split = message.content.substr(prefix.length).trim().split(/ +/);
        cmdDetails.base = split[0];
        cmdDetails.args = split.slice(1);
        return cmdDetails;
    }

    const regexTag = new RegExp(`^<@!?${bot.client.user.id}> `);
    if (regexTag.test(message.content)) {
        // first word is tag, second word is base, rest is arguments
        const split = message.content.trim().split(/ +/);
        cmdDetails.base = split[1];
        cmdDetails.args = split.slice(2);
        return cmdDetails;
    }

    // No prefix, no tag, not a command attempt.
    return;
}

module.exports = processor;
