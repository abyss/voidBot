const commands = [];
const commandMap = new Map();

function add(command) {
    commands.push(command);
    commandMap.set(command.config.cmd, command);
    command.config.alias.forEach(alias => {
        commandMap.set(alias, command);
    });
}

function remove(command) {
    const index = commands.indexOf(command);
    if (index < 0) { return false; }

    const result = commands.splice(index, 1);
    if (result.length) {
        commandMap.delete(command.config.cmd);
        command.config.alias.forEach(alias => {
            commandMap.delete(alias);
        });
        return true;
    } else {
        return false;
    }
}

function rebuild() {
    commandMap.clear();
    commands.forEach((command) => {
        add(command);
    });
}

function getCommand(commandText) {
    return commandMap.get(commandText.toLowerCase());
}

module.exports = {
    commands,
    add,
    remove,
    rebuild,
    getCommand
};
