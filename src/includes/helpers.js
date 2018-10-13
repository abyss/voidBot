exports.send = async function (channel, msg) {
    channel.send(msg).catch(error => {
        this.mod.bot.error(`There was an error posting msg: ${error}`);
    });
};
