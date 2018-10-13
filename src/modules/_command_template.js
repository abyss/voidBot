exports.run = async (msg, args) => {
    // Code to run whenever this command is called goes here!
    // Command also has access to (injected) this.mod, and this.cmdId
};

exports.config = {
    name: 'Name of the Command',
    cmd: 'commandtext',
    alias: ['any', 'aliases', 'here'],
    // Permissions use https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
    // or NOONE - which rejects everyone.
    botPermissions: [], // Guild permissions needed by the bot to use this command.
    defaultPermissions: [], // Default permissions to use this command by user
    location: 'ALL', // 'GUILD_ONLY', 'DM_ONLY', 'ALL' - where the command can be triggered
    description: 'Description of the command',
    debug: true // If true: unusable to anyone besides process.env.OWNER
};
