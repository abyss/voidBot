// Mocks before require()
jest.mock('../../../src/bot', () => ({
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
        guilds: {}
    }
}));

const bot = require('../../../src/bot');
const discord = require('../../../src/utils/discord');
const Collection = require('discord.js').Collection;
const { FLAGS } = require('discord.js').Permissions;

bot.client.guilds.cache = new Collection();

describe('discord util unit tests', () => {
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

        test('returns an empty string when passed undefined', () => {
            const data = undefined;
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

        test('returns the correct prefix when guild is valid', async () => {
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
        let guild;

        beforeAll(() => {
            guild = {
                roles: {
                    cache: new Collection()
                }
            };
            guild.roles.cache.set('54321', { name: '@everyone', id: '54321' });
            guild.roles.cache.set('12345', { name: 'role-name', id: '12345' });
        });

        test('returns everyone role when passed "everyone"', () => {
            const role = guild.roles.cache.get('54321');
            const result = discord.findExactRole(guild, 'everyone');
            expect(result).toBe(role);
        });

        test('returns correct role when passed an id', () => {
            const role = guild.roles.cache.get('12345');
            const result = discord.findExactRole(guild, role.id);
            expect(result).toBe(role);
        });

        test('returns correct role when passed a name', () => {
            const role = guild.roles.cache.get('12345');
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
        let guild;

        beforeAll(() => {
            guild = {
                roles: {
                    cache: new Collection()
                }
            };

            guild.roles.cache.set('54321', { name: '@everyone', id: '54321' });
            guild.roles.cache.set('12345', { name: 'role-name', id: '12345' });
            guild.roles.cache.set('123456789012345678', {
                name: 'role-long',
                id: '123456789012345678'
            });
        });

        test('returns correct role when text is a tag', () => {
            // tag id has to be 17-19 long
            const role = guild.roles.cache.get('123456789012345678');
            const result = discord.findRole(guild, `<@&${role.id}>`);
            expect(result).toBe(role);
        });

        test('returns correct role when text is the id', () => {
            const role = guild.roles.cache.get('12345');
            const result = discord.findRole(guild, role.id);
            expect(result).toBe(role);
        });

        test('returns correct role when text is the name', () => {
            const role = guild.roles.cache.get('12345');
            const result = discord.findRole(guild, role.name);
            expect(result).toBe(role);
        });

        test('returns correct role when text is slightly different than the name', () => {
            const roleAttempt = 'role_nme';
            const role = guild.roles.cache.get('12345');
            const result = discord.findRole(guild, roleAttempt);
            expect(result).toBe(role);
        });

        test('returns undefined when no role found', () => {
            const role = 'wat';
            const result = discord.findRole(guild, role);
            expect(result).not.toBeDefined();
        });
    });

    describe('findMember', () => {
        let guild;

        beforeAll(() => {
            guild = {
                members: {
                    cache: new Collection()
                }
            };

            guild.members.cache.set('54321', {
                displayName: 'member-name',
                id: '54321',
                user: { tag: 'member#0473' }
            });

            guild.members.cache.set('123456789012345678', {
                displayName: 'member-long',
                id: '123456789012345678',
                user: { tag: 'other#6777' }
            });
        });

        test('returns correct member when text is a tag', () => {
            const member = guild.members.cache.get('123456789012345678');
            let tag = `<@${member.id}>`;
            let result = discord.findMember(guild, tag);
            expect(result).toBe(member);

            // test other tag syntax
            tag = `<@!${member.id}>`;
            result = discord.findMember(guild, tag);
            expect(result).toBe(member);
        });

        test('returns correct member when text is the id', () => {
            const member = guild.members.cache.get('123456789012345678');
            const result = discord.findMember(guild, member.id);
            expect(result).toBe(member);
        });

        test('returns correct member when text is the displayName', () => {
            const member = guild.members.cache.get('123456789012345678');
            const result = discord.findMember(guild, member.displayName);
            expect(result).toBe(member);
        });

        test('returns correct member when text is slightly different than the displayName', () => {
            const member = guild.members.cache.get('54321');
            const memberAttempt = 'member_nme';
            const result = discord.findMember(guild, memberAttempt);
            expect(result).toBe(member);
        });

        test('returns correct member when text is the username', () => {
            const member = guild.members.cache.get('54321');
            const result = discord.findMember(guild, member.user.tag);
            expect(result).toBe(member);
        });

        test('returns correct member when text is slightly different than the username', () => {
            const member = guild.members.cache.get('123456789012345678');
            const memberAttempt = 'othello#6777';
            const result = discord.findMember(guild, memberAttempt);
            expect(result).toBe(member);
        });

        test('returns undefined when no member found', () => {
            const member = 'wat';
            const result = discord.findMember(guild, member);
            expect(result).not.toBeDefined();
        });
    });

    describe('serverStats', () => {
        let guild;

        beforeAll(() => {
            bot.db.set = jest.fn();

            guild = {
                available: true,
                id: '12345',
                name: 'Name',
                owner: {
                    user: {
                        id: '54321',
                        tag: 'owner#6789'
                    }
                }
            };
        });

        afterEach(() => {
            bot.db.set.mockClear();
        });

        test('sets data in database', async () => {
            await discord.serverStats(guild);
            expect(bot.db.set).toHaveBeenCalledWith(
                guild.id,
                expect.any(String),
                expect.any(Object)
            );
        });

        test('does not set data if guild is unavailable', async () => {
            guild.available = false;
            await discord.serverStats(guild);
            expect(bot.db.set).not.toHaveBeenCalled();
        });
    });

    describe('cleanPermissions', () => {
        let guild;

        beforeAll(() => {
            bot.db.get = jest.fn().mockResolvedValue();
            bot.db.delete = jest.fn().mockResolvedValue();

            guild = {
                id: '12345',
                name: 'Name',
                roles: {
                    cache: new Collection()
                }
            };
        });

        afterEach(() => {
            bot.db.get.mockClear();
            bot.db.delete.mockClear();
        });

        test('removes roles that don\'t exist anymore', async () => {
            // Setup Server Roles
            guild.roles.cache.set('12345', { name: '@everyone', id: '12345' });
            guild.roles.cache.set('67890', { name: 'role-a', id: '67890' });
            guild.roles.cache.set('54321', { name: 'role-b', id: '54321' });

            // Setup Permissions Object
            const permissions = {
                'prefix': {},
                'ping': {
                    '12345': 'allow',
                    '67890': 'deny',
                    '88888': 'allow' // should be deleted
                }
            };

            bot.db.get = jest.fn().mockResolvedValue(permissions);
            bot.db.delete = jest.fn().mockResolvedValue();
            await discord.cleanPermissions(guild);

            expect(bot.db.delete).toHaveBeenCalledWith(guild, 'permissions.ping.88888');
        });

        test('does not throw when permissions is not set', async () => {
            bot.db.get = jest.fn().mockResolvedValue(undefined);
            await expect(discord.cleanPermissions(guild)).resolves.toBeUndefined();
            expect(bot.db.delete).not.toHaveBeenCalled();
        });

        test('does not try to delete anything when permissions is not set', async () => {
            bot.db.get = jest.fn().mockReturnValue(undefined);
            expect(bot.db.delete).not.toHaveBeenCalled();
        });
    });

    describe('allServerUpkeep', () => {
        let guilds;
        let serverStatsToRestore, cleanPermissionsToRestore;

        beforeAll(() => {
            // Setup guilds cache collection
            guilds = bot.client.guilds.cache = new Collection;

            for (let i = 0; i < 5; i++) {
                const id = i.toString();
                guilds.set(id, { id }); // rough approximation of a guild object
            }

            // Safe keeping to restore after mocking
            serverStatsToRestore = discord.serverStats;
            cleanPermissionsToRestore = discord.cleanPermissions;

            // Mock
            discord.serverStats = jest.fn().mockReturnValue();
            discord.cleanPermissions = jest.fn().mockReturnValue();
        });

        afterEach(() => { // afterEach occurs before afterAll
            discord.serverStats.mockClear();
            discord.cleanPermissions.mockClear();
        });

        afterAll(() => {
            // Restore original functions
            discord.serverStats = serverStatsToRestore;
            discord.cleanPermissions = cleanPermissionsToRestore;
        });

        test('serverStats is called once per guild', async () => {
            await discord.allServerUpkeep();
            expect(discord.serverStats).toHaveBeenCalledTimes(5);
        });

        test('cleanPermissions is called once per guild', async () => {
            await discord.allServerUpkeep();
            expect(discord.cleanPermissions).toHaveBeenCalledTimes(5);
        });
    });

    describe('userColor', () => {
        let user, guild, color;
        let resolveIdToRestore;

        beforeAll(() => {
            color = 10698227; // #a33df3
            user = {
                id: '1'
            };

            guild = {
                members: {
                    cache: new Collection()
                }
            };

            guild.members.cache.set(user.id, {
                id: user.id,
                displayColor: color
            });

            resolveIdToRestore = discord.resolveId;
            discord.resolveId = jest.fn().mockReturnValue('1');
        });

        afterAll(() => {
            discord.resolveId = resolveIdToRestore;
        });

        test('returns the correct display color if a guild is passed', () => {
            const result = discord.userColor(user, guild);
            expect(result).toBe(color);
        });

        test('returns a valid color if guild does not exist', () => {
            const result = discord.userColor(user, undefined);
            expect(result).toBeColorResolvable();
        });
    });

    describe('EXTENDED_FLAGS', () => {
        test('discord.js permissions flags exists', () => {
            expect(FLAGS).toEqual(expect.any(Object));
        });

        test('has discord standard flags', () => {
            expect(discord.EXTENDED_FLAGS)
                .toEqual(expect.objectContaining(FLAGS));
        });

        test('has additional flag: NOONE', () => {
            expect(discord.EXTENDED_FLAGS)
                .toEqual(expect.objectContaining({ 'NOONE': '' }));
        });
    });
});
