let bot;

describe('bot smoke test', () => {
    test('can startup', () => {
        expect(() => {
            bot = require('../../src/bot');
        }).not.toThrow();
    });

    test('has a discord client', () => {
        expect(bot.client).toBeDefined();
    });

    test('can be destroyed', () => {
        expect(() => {
            bot.client.destroy();
        }).not.toThrow();
    });
});
