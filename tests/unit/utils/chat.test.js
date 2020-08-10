// Mocks before require()
jest.mock('../../../src/logger', () => ({
    error: jest.fn()
}));

jest.mock('../../../src/utils/discord', () => ({
    getGuildPrefix: jest.fn(),
    userColor: jest.fn().mockReturnValue('PURPLE')
}));

jest.mock('../../../src/bot', () => ({
    client: {
        user: {
            id: 1,
            avatarURL: jest.fn().mockReturnValue('https://i.imgur.com/yed5Zfk.gif')
        }
    }
}));

const chat = require('../../../src/utils/chat');

describe('chat util unit tests', () => {
    describe('send', () => {
        let channel, message;

        beforeAll(() => {
            channel = {};
            message = 'test message';
        });

        test('channel.send is called', async () => {
            channel.send = jest.fn().mockResolvedValue();
            await chat.send(channel, message);

            expect(channel.send).toHaveBeenCalled();
            channel.send = undefined;
        });

        test('error in send is properly handled', async () => {
            const unhandledRejectionFn = jest.fn();
            process.on('unhandledRejection', unhandledRejectionFn);

            const channel = {
                send: jest.fn().mockRejectedValue()
            };

            await chat.send(channel, message);

            expect(channel.send).toHaveBeenCalled();
            expect(unhandledRejectionFn).not.toHaveBeenCalled();
            process.removeListener('unhandledRejection', unhandledRejectionFn);
        });
    });

    describe('sendCommandHelp', () => {
        let channel, command;

        beforeAll(() => {
            channel = {
                guild: '1',
                send: jest.fn().mockResolvedValue()
            };

            command = {
                config: {
                    cmd: 'test',
                    name: 'Test',
                    description: 'test description',
                },
                usage: new Map()
            };
        });

        afterEach(() => {
            channel.send.mockClear();
        });

        test('sends embed object', async () => {
            await chat.sendCommandHelp(channel, command);

            const expected = expect.objectContaining({
                embed: expect.any(Object)
            });

            expect(channel.send).toBeCalledWith(expected);
        });

        test('embed object has author with name', async () => {
            await chat.sendCommandHelp(channel, command);

            const expected = expect.objectContaining({
                embed: expect.objectContaining({
                    author: expect.objectContaining({
                        name: expect.any(String)
                    })
                })
            });

            expect(channel.send).toBeCalledWith(expected);
        });

        test('embed object has author with valid icon_url', async () => {
            await chat.sendCommandHelp(channel, command);

            const expected = expect.objectContaining({
                embed: expect.objectContaining({
                    author: expect.objectContaining({
                        icon_url: expect.toBeValidURL()
                    })
                })
            });

            expect(channel.send).toBeCalledWith(expected);
        });

        test('embed object has ColorResolvable color', async () => {
            await chat.sendCommandHelp(channel, command);

            const expected = expect.objectContaining({
                embed: expect.objectContaining({
                    color: expect.toBeColorResolvable()
                })
            });

            expect(channel.send).toBeCalledWith(expected);
        });

        test('embed object has title', async () => {
            await chat.sendCommandHelp(channel, command);

            const expected = expect.objectContaining({
                embed: expect.objectContaining({
                    color: expect.toBeColorResolvable()
                })
            });

            expect(channel.send).toBeCalledWith(expected);
        });

        test('command with no usage generates field based on description', async () => {
            command.usage = new Map();

            await chat.sendCommandHelp(channel, command);

            const expected = expect.objectContaining({
                embed: expect.objectContaining({
                    fields: expect.any(Array)
                })
            });

            expect(channel.send).toBeCalledWith(expected);
        });

        test('command with usage generates fields based on usage', async () => {
            const usage = new Map();
            usage.set('', 'usage test');
            command.usage = usage;

            await chat.sendCommandHelp(channel, command);

            const expected = expect.objectContaining({
                embed: expect.objectContaining({
                    fields: expect.any(Array)
                })
            });

            expect(channel.send).toBeCalledWith(expected);
        });

        test('command with usage generates description field', async () => {
            const usage = new Map();
            usage.set('', 'usage test');
            command.usage = usage;

            await chat.sendCommandHelp(channel, command);

            const expected = expect.objectContaining({
                embed: expect.objectContaining({
                    description: expect.stringContaining(command.config.description),
                })
            });

            expect(channel.send).toBeCalledWith(expected);
        });
    });
});
