exports.run = async (msg, args) => {
    try {
        if (args.length > 0) {
            await this.mod.dbTestSet(msg.guild.id, args.join(' '));
            await msg.channel.send(':ok_hand:');
        }
    } catch (error) {
        msg.channel.send(`:x:  **|  Error:** ${error}`);
    }
};

exports.config = {
    name: 'Set DB Test',
    cmd: 'set',
    alias: [],
    botPermissions: [], // Permissions needed by the bot to use this command.
    defaultPermissions: [], // Default permissions to use this command by user
    location: 'GUILD_ONLY', // 'GUILD_ONLY', 'DM_ONLY', 'ALL'
    description: 'Description of the command',
    debug: true // This makes it unusable to anyone besides process.env.OWNER
};
