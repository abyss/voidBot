jest.mock('../../../src/bot', () => ({
    config: {
        isOwner: jest.fn()
    },
    db: {
        get: jest.fn(),
        set: jest.fn(),
        delete: jest.fn()
    }
}));

const bot = require('../../../src/bot');
const permissions = require('../../../src/modular-commands/permissions');
const Collection = require('discord.js').Collection;

describe('modular-commands - permissions integration tests', () => {
    describe('hasPermission', () => {
        let guild, member, command;

        beforeAll(() => {
            guild = {};
            member = {
                hasPermission: jest.fn(),
                roles: {
                    cache: new Collection()
                }
            };
            command = {
                id: '1234',
                config: {
                    defaultPermissions: []
                }
            };
        });

        test('returns true if database permissions do not exist and default is true', async () => {
            member.hasPermission.mockReturnValue(true);
            bot.db.get.mockResolvedValue(undefined);

            const result = await permissions.hasPermission(guild, member, command);

            expect(result).toBeTruthy();
        });

        test('returns false if database permissions do not exist and default is false', async () => {
            member.hasPermission.mockReturnValue(false);
            bot.db.get.mockResolvedValue(undefined);

            const result = await permissions.hasPermission(guild, member, command);

            expect(result).toBeFalsy();
        });

        test('returns true if database permissions exist but are not specified and default is true', async () => {
            member.hasPermission.mockReturnValue(true);
            bot.db.get.mockResolvedValue({});

            const result = await permissions.hasPermission(guild, member, command);

            expect(result).toBeTruthy();
        });

        test('returns false if database permissions exist but are not specified and default is false', async () => {
            member.hasPermission.mockReturnValue(false);
            bot.db.get.mockResolvedValue({});

            const result = await permissions.hasPermission(guild, member, command);

            expect(result).toBeFalsy();
        });
    });
});
