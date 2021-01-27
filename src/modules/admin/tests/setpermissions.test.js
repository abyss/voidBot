jest.mock('../../../bot', () => ({
    db: {
        get: jest.fn()
    },
    commands: {
        lookup: {
            getCommand: jest.fn()
        }
    },
    debug: jest.fn(),
    client: {
        user: {
            id: '12345'
        }
    }
}));

jest.mock('../../../utils/chat', () => ({
    send: jest.fn()
}));

jest.mock('../../../utils/discord', () => ({
    findRole: jest.fn()
}));

jest.mock('../../../modular-commands/permissions', () => ({
    hasPermission: jest.fn().mockResolvedValue(),
    setPermission: jest.fn().mockResolvedValue()
}));

const bot = require('../../../bot');
const chat = require('../../../utils/chat');
const discord = require('../../../utils/discord');
const setpermissions = require('../commands/setpermissions');
const { hasPermission, setPermission } = require('../../../modular-commands/permissions');

describe('admin.setpermissions command', () => {
    let msg, args, command, role;

    beforeAll(() => {
        msg = {
            channel: {},
            guild: {},
            member: {
                roles: {
                    highest: {
                        position: 2
                    }
                }
            }
        };

        args = ['ping', 'everyone', 'allow'];
        command = {
            config: {
                preventLockout: false
            }
        };
        role = {
            position: 1
        };
    });

    afterEach(() => {
        chat.send.mockClear();
        hasPermission.mockClear();
        setPermission.mockClear();
    });

    test('run with less than 3 arguments returns false', async () => {
        const result = await setpermissions.run(msg, [1, 2]);

        expect(result).toBe(false);
    });

    test('command not found returns false', async () => {
        bot.commands.lookup.getCommand.mockReturnValue(undefined);

        const result = await setpermissions.run(msg, args);

        expect(result).toBe(false);
    });

    test('role not found returns false', async () => {
        bot.commands.lookup.getCommand.mockReturnValue(command);
        discord.findRole.mockReturnValue(undefined);

        const result = await setpermissions.run(msg, args);

        expect(result).toBe(false);
    });

    test('state not allowed returns false', async () => {
        bot.commands.lookup.getCommand.mockReturnValue(command);
        discord.findRole.mockReturnValue(role);
        args[2] = 'InvalidState';

        const result = await setpermissions.run(msg, args);

        expect(result).toBe(false);
    });

    test('role is higher than the users highest calculated position does not setPermission', async () => {
        bot.commands.lookup.getCommand.mockReturnValue(command);
        discord.findRole.mockReturnValue(role);
        args[2] = 'allow';
        role.position = 3;

        await setpermissions.run(msg, args);

        expect(setPermission).not.toHaveBeenCalled();
    });

    test('sets a permission of a command without preventLockout', async () => {
        bot.commands.lookup.getCommand.mockReturnValue(command);
        discord.findRole.mockReturnValue(role);
        args[2] = 'allow';
        role.position = 1;
        command.config.preventLockout = false;

        await setpermissions.run(msg, args);

        expect(setPermission).toHaveBeenCalled();
    });

    test('sets a permission of a command with preventLockout when lockout would not occur', async () => {
        bot.commands.lookup.getCommand.mockReturnValue(command);
        discord.findRole.mockReturnValue(role);
        args[2] = 'allow';
        role.position = 1;
        command.config.preventLockout = true;
        hasPermission.mockResolvedValue(true);

        await setpermissions.run(msg, args);

        expect(setPermission).toHaveBeenCalledTimes(1);
    });

    test('sets then unsets a permission of a command with preventLockout when lockout would occur', async () => {
        bot.commands.lookup.getCommand.mockReturnValue(command);
        discord.findRole.mockReturnValue(role);
        args[2] = 'allow';
        role.position = 1;
        command.config.preventLockout = true;
        hasPermission.mockResolvedValue(false);

        await setpermissions.run(msg, args);

        expect(setPermission).toHaveBeenCalledTimes(2);
    });
});
