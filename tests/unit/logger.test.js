const logger = require('../../src/logger');

describe('logger unit tests', () => {
    describe('init', () => {
        test('does not throw when environment is production', () => {
            process.env.NODE_ENV = 'production';
            expect(() => {
                logger.init();
            }).not.toThrow();
        });

        test('does not throw when environment is development', () => {
            process.env.NODE_ENV = 'development';
            expect(() => {
                logger.init();
            }).not.toThrow();
        });

        test('does not throw when environment is test', () => {
            process.env.NODE_ENV = 'test';
            expect(() => {
                logger.init();
            }).not.toThrow();
        });
    });

    describe('debug', () => {
        let consoleLogToRestore;

        beforeAll(() => {
            logger.config.log = true;

            consoleLogToRestore = console.log;
            console.log = jest.fn();
        });

        afterEach(() => {
            console.log.mockClear();
        });

        afterAll(() => {
            console.log = consoleLogToRestore;
        });

        test('logs one line', () => {
            logger.debug('test logging message');
            expect(console.log).toHaveBeenCalled();
        });

        test('logs multiple lines', () => {
            const messages = [
                'one message',
                'two message',
                'red message',
                'blue message'
            ];

            logger.debug.apply(null, messages);

            expect(console.log).toHaveBeenCalledTimes(4);
        });
    });

    describe('error', () => {
        let consoleErrorToRestore;

        beforeAll(() => {
            logger.config.error = true;

            consoleErrorToRestore = console.log;
            console.error = jest.fn();
        });

        afterEach(() => {
            console.error.mockClear();
        });

        afterAll(() => {
            console.error = consoleErrorToRestore;
        });

        test('logs one line', () => {
            logger.error('test logging message');
            expect(console.error).toHaveBeenCalled();
        });

        test('logs multiple lines', () => {
            const messages = [
                'one message',
                'two message',
                'red message',
                'blue message'
            ];

            logger.error.apply(null, messages);

            expect(console.error).toHaveBeenCalledTimes(4);
        });
    });

    describe('log', () => {
        let consoleLogToRestore;
        beforeAll(() => {
            logger.config.log = true;

            consoleLogToRestore = console.log;
            console.log = jest.fn();
        });

        afterEach(() => {
            console.log.mockClear();
        });

        afterAll(() => {
            console.log = consoleLogToRestore;
        });

        test('logs one line', () => {
            logger.log('test logging message');
            expect(console.log).toHaveBeenCalled();
        });

        test('logs multiple lines', () => {
            const messages = [
                'one message',
                'two message',
                'red message',
                'blue message'
            ];

            logger.log.apply(null, messages);

            expect(console.log).toHaveBeenCalledTimes(4);
        });
    });
});
