const logger = require('../logger');

exports.send = async function (channel, msg) {
    channel.send(msg).catch(error => {
        logger.error(`There was an error posting msg: ${error}`);
    });
};

exports.commandHelp = function (command) {
    // TODO: Build a help for given command message-object
    return '';
};
