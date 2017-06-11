exports.run = async (msg, args) => {
    if (!(args.length > 0)) { throw 'Have to pass at least one argument'; }

    await this.mod.loadCommand(args.join(' '));
    msg.channel.send(':ok_hand:');
};

exports.config = {
    name: 'Load Command',
    cmd: 'loadcommand',
    alias: ['lc', 'load'],
    permissions: [],
    location: 'ALL', // 'GUILD_ONLY', 'DM_ONLY', 'ALL' - where the command can be triggered
    description: 'Load a command by name',
    debug: true // This makes it unusable to anyone besides process.env.OWNER
};
