let bot;

describe('bot smoke test', () => {
    test('can startup', () => {
        bot = require('../src/bot');
    });

    test('has a discord client', () => {
        expect(bot.client).toBeDefined();
    });

    test('can be destroyed', () => {
        bot.client.destroy();
    });
});
