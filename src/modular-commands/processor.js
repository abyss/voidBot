const bot = require('../bot');
const { getGuildPrefix } = require('../utils/discord');
const { sendCommandHelp } = require('../utils/chat');
const { getCommand } = require('./hashmap');
const { checkDebug, hasPermission, validLocation } = require('./permissions');

async function processor(message) {
    const commandStructure = await commandAttemptCheck(message);
    if (!commandStructure) return; // not a command attempt

    const command = getCommand(commandStructure.base);
    if (!command) return;

    if (!validLocation(message.channel.type, command)) return;
    if (!checkDebug(message.author, command)) return;

    if (message.channel.type === 'text') {
        if (!await hasPermission(message.guild, message.member, command)) {
            return;
        }
    }

    const success = await command.run(message, commandStructure.args);

    // Only print help if command returns explicit false, not undefined.
    if (success === false) sendCommandHelp(message.channel, command);
}

async function commandAttemptCheck(message) {
    if (message.channel.type === 'dm' || message.channel.type === 'group') {
        // for direct messages, first word is base, rest is arguments, no prefix
        const split = message.content.trim().split(/ +/);
        return { base: split[0], args: split.slice(1) };
    }

    // If it's not a dm, and it's not a text channel, we don't care about it
    if (message.channel.type !== 'text') return;

    const prefix = await getGuildPrefix(message.guild);

    if (message.content.startsWith(prefix)) {
        // crop the prefix. first word is base, rest is arguments
        const split = message.content.substr(prefix.length).trim().split(/ +/);
        return { base: split[0], args: split.slice(1) };
    }

    const regexTag = new RegExp(`^<@!?${bot.client.user.id}> `);
    if (regexTag.test(message.content)) {
        // first word is tag, second word is base, rest is arguments
        const split = message.content.trim().split(/ +/);
        return { base: split[1], args: split.slice(2) };
    }

    // No prefix, no tag, not a command attempt.
    return;
}

module.exports = processor;
