// Mocking bot because it has a lot of code in loading utils/discord that is unrelated to tests
jest.mock('../../../src/bot', () => {});

const discord = require('../../../src/utils/discord');
const Collection = require('discord.js').Collection;

describe('discord util integration tests', () => {
    describe('userColor', () => {
        let user, guild, color;

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
        });

        test('returns correct display color when passed a user object', () => {
            const result = discord.userColor(user, guild);
            expect(result).toBe(color);
        });

        test('returns correct display color when passed a user id', () => {
            const result = discord.userColor(user.id, guild);
            expect(result).toBe(color);
        });
    });
});
