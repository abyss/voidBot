exports.run = async (msg) => {
    try {
        const result = await this.mod.dbTestGet2(msg.guild);
        await msg.channel.send(`${result}`);
    } catch (error) {
        msg.channel.send(`:x:  **|  Error:** ${error}`);
    }
};

exports.config = {
    name: 'Get DB Test',
    cmd: 'get2',
    alias: [],
    permissions: [],
    location: 'GUILD_ONLY', // 'GUILD_ONLY', 'DM_ONLY', 'ALL'
    description: 'Description of the command',
    debug: true // This makes it unusable to anyone besides process.env.OWNER
};
