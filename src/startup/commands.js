const CommandHandler = require('../includes/command-handler');
const ModuleHandler = require('../includes/module-handler');

module.exports = function init(bot) {
    bot.handlers.commands = new CommandHandler(bot);
    bot.handlers.mods = new ModuleHandler(bot);
};
