const EventEmitter = require('events');

// Mock Discord.js Client
jest.mock('discord.js', () => ({}));

const discordjs = require('discord.js');
discordjs.Client = EventEmitter;
discordjs.Intents = {}; // Intents has to exist on discordjs

// Mock startup and discord util module since those aren't being tested
jest.mock('../../src/startup', () => {});

jest.mock('../../src/utils/discord', () => ({
    serverStats: jest.fn(),
    allServerUpkeep: jest.fn()
}));

require('../../src/utils/discord');
const bot = require('../../src/bot');

// Mock some additional Client() functionality
bot.client.setInterval = jest.fn();
bot.client.user = {
    id: '12345',
    tag: 'user#1234',
    setPresence: jest.fn()
};
bot.client.generateInvite = jest.fn().mockResolvedValue('https://invitelink');
bot.client.users = { cache: new Map() };
bot.client.guilds = { cache: new Map() };

bot.log = jest.fn();
bot.error = jest.fn();
bot.config = {
    permissions: []
};
bot.commands = {
    processor: jest.fn()
};

const discordUtil = require('../../src/utils/discord');

describe('bot unit tests', () => {
    test('on(ready) does not throw', () => {
        expect(() => {
            bot.client.emit('ready');
        }).not.toThrow();
    });

    describe('on(message)', () => {
        let message;

        beforeAll(() => {
            message = {
                content: 'test message',
                author: {
                    bot: false
                }
            };
        });

        afterEach(() => {
            bot.commands.processor.mockClear();
        });

        test('does not throw', () => {
            expect(() => {
                bot.client.emit('message', message);
            }).not.toThrow();
        });

        test('calls command processor', () => {
            bot.client.emit('message', message);
            expect(bot.commands.processor).toHaveBeenCalled();
        });

        test('does not call command processor for bot messages', () => {
            message.author.bot = true;
            bot.client.emit('message', message);
            expect(bot.commands.processor).not.toHaveBeenCalled();
        });
    });

    describe('on(guildCreate)', () => {
        let guild;

        beforeAll(() => {
            guild = {
                name: 'guild',
                id: '12345'
            };
        });

        afterEach(() => {
            discordUtil.serverStats.mockClear();
        });

        test('does not throw', () => {
            expect(() => {
                bot.client.emit('guildCreate', guild);
            }).not.toThrow();
        });

        test('calls serverStats', () => {
            bot.client.emit('guildCreate', guild);
            expect(discordUtil.serverStats).toHaveBeenCalled();
        });
    });

    test('on(error) does not throw when passed an error', () => {
        expect(() => {
            bot.client.emit('error', new Error('test'));
        }).not.toThrow();
    });
});
