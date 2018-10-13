exports.send = async function (channel, msg) {
    channel.send(msg).catch(error => {
        this.mod.bot.error(`There was an error posting msg: ${error}`);
    });
};

exports.findRole = function (guild, roleText) {
    // Override "everyone" to "@everyone" for a match
    if (roleText === 'everyone') {
        roleText = '@everyone';
    }

    let role = guild.roles.find(role => {
        if (role.name === roleText) return true;
        if (role.id === roleText) return true;
        return false;
    });

    return role;
};
