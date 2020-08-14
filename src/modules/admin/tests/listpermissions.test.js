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
    getGuildPrefix: jest.fn().mockReturnValue('%'),
    userColor: jest.fn().mockReturnValue(1)
}));

const Collection = require('discord.js').Collection;
const bot = require('../../../bot');
const listpermissions = require('../commands/listpermissions');
const chat = require('../../../utils/chat');

describe('admin.listpermissions command', () => {
    describe('individual command (listCommandPermissions)', () => {
        let msg, args, command;
        let guildId, roleOneId, roleTwoId;

        beforeAll(() => {
            guildId = '111111111111111111';
            roleOneId = '123456789012345678';
            roleTwoId = '987654321098765432';

            msg = {
                channel: {},
                guild: {
                    id: guildId,
                    roles: {
                        cache: new Collection()
                    }
                }
            };

            msg.guild.roles.cache.set(guildId, {
                toString: () => '@everyone',
                id: guildId,
                calculatedPosition: 0
            });

            msg.guild.roles.cache.set(roleOneId, {
                toString: () => '@first-role',
                id: roleOneId,
                calculatedPosition: 1
            });

            msg.guild.roles.cache.set(roleTwoId, {
                toString: () => '@second-role',
                id: roleTwoId,
                calculatedPosition: 2
            });

            args = ['command'];

            command = {
                id: 'command-id',
                config: {
                    cmd: 'command-cmd',
                    defaultPermissions: ['MANAGE_GUILD'], // Default permissions to use this command by user
                }
            };
        });

        afterEach(() => {
            chat.send.mockClear();
        });

        test('returns false when passed a command that cannot be found', async () => {
            bot.commands.lookup.getCommand.mockReturnValue(undefined);
            const result = await listpermissions.run(msg, args);
            expect(result).toBe(false);
        });

        test('passed command with perm changes sends embed with info', async () => {
            bot.commands.lookup.getCommand.mockReturnValue(command);

            bot.db.get.mockReturnValue({
                [roleOneId]: 'allow',
                [roleTwoId]: 'deny'
            });

            await listpermissions.run(msg, args);

            expect(chat.send).toBeCalledWith(
                msg.channel,
                expect.embedContaining('@first-role - allow')
            );
        });

        test('passed a command with default permissions sends embed with info', async () => {
            bot.commands.lookup.getCommand.mockReturnValue(command);

            bot.db.get.mockReturnValue({});

            await listpermissions.run(msg, args);

            expect(chat.send).toBeCalledWith(
                msg.channel,
                expect.embedContaining('MANAGE_GUILD - allow')
            );
        });

        test('passed command with everyone permissions changes sends embed with info', async () => {
            bot.commands.lookup.getCommand.mockReturnValue(command);

            bot.db.get.mockReturnValue({
                [guildId]: 'allow'
            });

            await listpermissions.run(msg, args);

            expect(chat.send).toBeCalledWith(
                msg.channel,
                expect.embedContaining('@everyone - allow')
            );
        });

        test('passed command with default deny everyone sends embed with info', async () => {
            command.config.defaultPermissions = ['NOONE'];

            bot.commands.lookup.getCommand.mockReturnValue(command);

            bot.db.get.mockReturnValue({});

            await listpermissions.run(msg, args);

            expect(chat.send).toBeCalledWith(
                msg.channel,
                expect.embedContaining('@everyone - deny')
            );
        });

        test('regression: passed command with no permissions in database does not throw', async () => {
            command.config.defaultPermissions = ['NOONE'];

            bot.commands.lookup.getCommand.mockReturnValue(command);

            bot.db.get.mockReturnValue();

            await listpermissions.run(msg, args);

            expect(chat.send).toBeCalledWith(
                msg.channel,
                expect.embedContaining('@everyone - deny')
            );
        });
    });
});
