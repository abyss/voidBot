exports.run = async (msg, args) => {
    if (!(args.length > 0)) { throw 'Have to pass at least one argument'; }

    await this.mod.bot.commandHandler.unloadCommand(args.join(' '));
    msg.channel.send(':ok_hand:');
};

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
