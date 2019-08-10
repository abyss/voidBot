const permissions = require('../includes/permissions');
const CommandHandler = require('../includes/command-handler');

module.exports = (bot) => {
    bot.handlers.permissions = permissions;
    bot.handlers.commands = new CommandHandler(bot);

    // TODO: CommandHandler migrated, this goes back above the module.exports
    const modules = require('../includes/modules');

    bot.handlers.mods = modules;
};
