const { send } = require('../../../utils/chat');
const bot = require('../../../bot');

exports.run = async (msg, args) => {
    if (!(args.length > 0)) {
        send(msg.channel, 'Unknown options');
        return false;
    }

    const cmd = bot.commands.lookup.getCommand(args.join(' '));
    if (!cmd) {
        await send(msg.channel, `Command not found: ${args.join(' ')}`);
        return true;
    }

    bot.commands.loader.unload(cmd);
    await send(msg.channel, ':ok_hand:');
    return true;
};

const usage = new Map();
usage.set('<command>', 'Unload <command>');
exports.usage = usage;

exports.config = {
    name: 'Unload Command',
    cmd: 'unloadcommand',
    alias: ['unload', 'uc'],
    botPermissions: [], // Permissions needed by the bot to use this command.
    defaultPermissions: [], // Default permissions to use this command by user
    location: 'ALL', // 'GUILD_ONLY', 'DM_ONLY', 'ALL'
    description: 'Unload a command by id',
    debug: true // This makes it unusable to anyone besides process.env.OWNER
};
