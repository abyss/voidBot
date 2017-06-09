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
    permissions: [],
    location: 'GUILD_ONLY', // 'GUILD_ONLY', 'DM_ONLY', 'ALL'
    description: 'Description of the command',
    debug: true // This makes it unusable to anyone besides process.env.OWNER
};
