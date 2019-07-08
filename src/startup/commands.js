const CommandHandler = require('../includes/command-handler');
const ModuleHandler = require('../includes/module-handler');

module.exports = function init(bot) {
    bot.cmdHandler = new CommandHandler(bot);
    bot.modHandler = new ModuleHandler(bot);
};
