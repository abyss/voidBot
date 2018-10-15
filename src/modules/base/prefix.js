const { send } = require('../../includes/helpers');

exports.run = async (msg, args) => {
    if (args.length > 0) {
        await this.mod.setGuildPrefix(msg.guild, args.join(' '));
        await send(msg.channel, ':ok_hand:');
    } else {
        // show current prefix
        await send(msg.channel, 'This prefix for this guild is: ' +
            `\`${await this.mod.getGuildPrefix(msg.guild)}\``);
    }

    return true;
};

exports.usage = new Map([
    ['', 'Output the current prefix for the guild'],
    ['<prefix>', 'Change the prefix to <prefix>'],
]);

exports.config = {
    name: 'Set Prefix',
    cmd: 'prefix',
    alias: [],
    botPermissions: [], // Permissions needed by the bot to use this command.
    defaultPermissions: ['MANAGE_GUILD'], // Default permissions to use this command by user
    location: 'GUILD_ONLY', // 'GUILD_ONLY', 'DM_ONLY', 'ALL'
    description: 'Sets the bot prefix for the server',
    debug: false // This makes it unusable to anyone besides process.env.OWNER
};
