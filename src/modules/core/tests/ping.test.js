jest.mock('../../../utils/chat', () => ({
    send: jest.fn()
}));

jest.mock('../../../bot', () => ({
    client: {
        ws: {
            ping: 321
        }
    }
}));

const { send } = require('../../../utils/chat');
const { client } = require('../../../bot');
const ping = require('../commands/ping');

describe('core.ping command', () => {
    test('sends a message containing the ping', async () => {
        const message = {
            channel: {}
        };

        await ping.run(message);

        expect(send).toHaveBeenCalledWith(
            message.channel,
            expect.stringContaining(`${client.ws.ping}`)
        );
    });
});
