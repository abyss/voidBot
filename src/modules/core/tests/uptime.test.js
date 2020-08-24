jest.mock('../../../utils/chat', () => ({
    send: jest.fn()
}));

jest.mock('../../../bot', () => ({
    client: {
        uptime: // milliseconds
            1000 * 4 + // 4 seconds
            1000 * 60 * 3 + // 3 minutes
            1000 * 60 * 60 * 2 + // 2 hours
            1000 * 60 * 60 * 24 * 1 // 1 day
    }
}));

const { send } = require('../../../utils/chat');
const uptime = require('../commands/uptime');

describe('core.ping command', () => {
    test('sends a message containing the ping', async () => {
        const message = {
            channel: {}
        };

        await uptime.run(message);

        expect(send).toHaveBeenCalledWith(
            message.channel,
            expect.stringContaining('1 day, 2 hours, 3 minutes, and 4 seconds')
        );
    });
});
