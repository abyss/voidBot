const { send } = require('../../includes/helpers');

exports.run = async (msg, args) => {
    if (!(args.length > 0)) {
        // TODO: Update this once return false prints usage instructions
        send(msg.channel, 'Have to pass at least one argument');
        return false;
    }

    await this.mod.bot.commandHandler.unloadCommand(args.join(' '));
    await this.mod.bot.commandHandler.loadCommand(args.join(' '));
    send(msg.channel, ':ok_hand:');

    return true;
};

exports.usage = new Map();

exports.config = {
    name: 'Reload Command',
    cmd: 'reloadcommand',
    alias: ['reload'],
    botPermissions: [], // Permissions needed by the bot to use this command.
    defaultPermissions: [], // Default permissions to use this command by user
    location: 'ALL', // 'GUILD_ONLY', 'DM_ONLY', 'ALL'
    description: 'Reload a command by name',
    debug: true // This makes it unusable to anyone besides process.env.OWNER
};
