// Mocks before require()
jest.mock('../../src/bot', () => ({
    db: {
        get: jest.fn(),
        set: jest.fn(),
        delete: jest.fn()
    },
    config: {
        prefix: '/'
    },
    debug: jest.fn(),
    client: {
        guilds: {
            cache: {
                array: jest.fn()
            }
        }
    }
}));

const bot = require('../../src/bot');
const discord = require('../../src/utils/discord');

describe('discord util', () => {
    describe('resolveId', () => {
        test('returns a string when passed id (string)', () => {
            const data = '1';
            const result = discord.resolveId(data);
            expect(result).toBe('1');
        });

        test('returns a string when passed object with id', () => {
            const data = { id: '1' };
            const result = discord.resolveId(data);
            expect(result).toBe('1');
        });

        test('returns an empty string when passed number', () => {
            const data = 1;
            const result = discord.resolveId(data);
            expect(result).toBe('');
        });

        test('returns an empty string when passed invalid object', () => {
            const data = { bad: 'data' };
            const result = discord.resolveId(data);
            expect(result).toBe('');
        });
    });

    describe('getGuildPrefix', () => {
        test('returns empty string when guild is invalid', async () => {
            bot.db.get = jest.fn().mockReturnValue('%');
            const result = await discord.getGuildPrefix();
            expect(result).toBe('');
        });

        test('returns the correct prefix', async () => {
            const prefix = '%';
            bot.db.get = jest.fn().mockReturnValue(prefix);
            const result = await discord.getGuildPrefix('1');
            expect(result).toBe(prefix);
        });

        test('returns the bot prefix when guild prefix is undefined', async () => {
            bot.db.get = jest.fn().mockReturnValue(undefined);
            const result = await discord.getGuildPrefix('1');
            expect(result).toBe(bot.config.prefix);
        });

        test('database is queried with the guild id and prefix key', async () => {
            const guildId = '12345';
            bot.db.get = jest.fn();
            await discord.getGuildPrefix(guildId);
            expect(bot.db.get).toHaveBeenCalledWith(guildId, 'prefix');
            bot.db.get.mockClear();
        });
    });

    describe('findExactRole', () => {
        const guild = {
            roles: {
                cache: [
                    { name: '@everyone', id: '54321' },
                    { name: 'role-name', id: '12345' },
                ]
            }
        };

        test('returns everyone role when passed "everyone"', () => {
            const result = discord.findExactRole(guild, 'everyone');
            expect(result).toBe(guild.roles.cache[0]);
        });

        test('returns correct role when passed an id', () => {
            const role = guild.roles.cache[1];
            const result = discord.findExactRole(guild, role.id);
            expect(result).toBe(role);
        });

        test('returns correct role when passed a name', () => {
            const role = guild.roles.cache[1];
            const result = discord.findExactRole(guild, role.name);
            expect(result).toBe(role);
        });

        test('returns undefined if role isn\'t found', () => {
            const role = 'nope';
            const result = discord.findExactRole(guild, role);
            expect(result).not.toBeDefined();
        });
    });

    describe('findRole', () => {
        const guild = {
            roles: {
                cache: [
                    { name: '@everyone', id: '54321' },
                    { name: 'role-name', id: '12345' },
                    { name: 'role-long', id: '123456789012345678' }
                ]
            }
        };

        test('returns correct role when text is a tag', () => {
            const role = '<@&123456789012345678>';
            const result = discord.findRole(guild, role);
            expect(result).toBe(guild.roles.cache[2]);
        });

        test('returns correct role when text is the id', () => {
            const role = guild.roles.cache[1].id;
            const result = discord.findRole(guild, role);
            expect(result).toBe(guild.roles.cache[1]);
        });

        test('returns correct role when text is the name', () => {
            const role = guild.roles.cache[1].name;
            const result = discord.findRole(guild, role);
            expect(result).toBe(guild.roles.cache[1]);
        });

        test('returns correct role when text is slightly different than the name', () => {
            const role = 'role_nme';
            const result = discord.findRole(guild, role);
            expect(result).toBe(guild.roles.cache[1]);
        });

        test('returns undefined when no role found', () => {
            const role = 'wat';
            const result = discord.findRole(guild, role);
            expect(result).not.toBeDefined();
        });
    });

    describe('findMember', () => {
        const guild = {
            members: {
                cache: [
                    {
                        displayName: 'member-name',
                        id: '54321',
                        user: { tag: 'member#0473' }
                    },
                    {
                        displayName: 'member-long',
                        id: '123456789012345678',
                        user: { tag: 'other#6777' }
                    }
                ]
            }
        };

        test('returns correct member when text is a tag', () => {
            let member = '<@123456789012345678>';
            let result = discord.findMember(guild, member);
            expect(result).toBe(guild.members.cache[1]);

            // test other tag syntax
            member = '<@!123456789012345678>';
            result = discord.findMember(guild, member);
            expect(result).toBe(guild.members.cache[1]);
        });

        test('returns correct member when text is the id', () => {
            const member = guild.members.cache[1].id;
            const result = discord.findMember(guild, member);
            expect(result).toBe(guild.members.cache[1]);
        });

        test('returns correct member when text is the displayName', () => {
            const member = guild.members.cache[1].displayName;
            const result = discord.findMember(guild, member);
            expect(result).toBe(guild.members.cache[1]);
        });

        test('returns correct member when text is slightly different than the displayName', () => {
            const member = 'member_nme';
            const result = discord.findMember(guild, member);
            expect(result).toBe(guild.members.cache[0]);
        });

        test('returns correct member when text is the username', () => {
            const member = guild.members.cache[1].user.tag;
            const result = discord.findMember(guild, member);
            expect(result).toBe(guild.members.cache[1]);
        });

        test('returns correct member when text is slightly different than the username', () => {
            const member = 'othello#6777';
            const result = discord.findMember(guild, member);
            expect(result).toBe(guild.members.cache[1]);
        });

        test('returns undefined when no member found', () => {
            const member = 'wat';
            const result = discord.findMember(guild, member);
            expect(result).not.toBeDefined();
        });
    });
});
