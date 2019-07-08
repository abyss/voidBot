const { send } = require('../../includes/helpers');

exports.run = async (msg, args) => {
    if (!(args.length > 0)) {
        send(msg.channel, 'Unknown options');
        return false;
    }

    await this.mod.bot.handlers.commands.unloadCommand(args.join(' '));
    await send(msg.channel, ':ok_hand:');

    return true;
};

exports.usage = new Map();

exports.config = {
    name: 'Unload Command',
    cmd: 'unloadcommand',
    alias: ['unload'],
    botPermissions: [], // Permissions needed by the bot to use this command.
    defaultPermissions: [], // Default permissions to use this command by user
    location: 'ALL', // 'GUILD_ONLY', 'DM_ONLY', 'ALL'
    description: 'Unload a command by id',
    debug: true // This makes it unusable to anyone besides process.env.OWNER
};
