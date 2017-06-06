exports.run = async (msg, args) => { // eslint-disable-line
    // Code to run whenever this command is called goes here!
    // Command also has access to (injected) this.mod, and this.cmdId
};

exports.config = {
    name: 'Name of the Command',
    cmd: 'commandtext',
    alias: ['any', 'aliases', 'here'],
    permissions: [],
    location: 'ALL', // 'GUILD_ONLY', 'DM_ONLY', 'ALL' - where the command can be triggered
    description: 'Description of the command',
    debug: true // This makes it unusable to anyone besides process.env.OWNER
};
