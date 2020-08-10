const general = require('../../../src/utils/general');

describe('general util unit tests', () => {
    describe('parseBoolean', () => {
        test.each([
            [true, true], // bool
            [false, false],
            [1, true], // int
            [0, false],
            ['true', true], // bool as string
            ['false', false],
            ['FaLsE', false], // check that case doesn't matter
            ['1', true], // int as string
            ['0', false],
            ['yes', true], // yes/no
            ['no', false],
            ['on', true], // on/off
            ['off', false]
        ])('%s is truth value: %s', (value, expected) => {
            expect(general.parseBoolean(value)).toBe(expected);
        });
    });

    describe('shuffleArray', () => {
        const sample = [1, 2, 3, 4, 5];

        test('returned array is same length', () => {
            const result = general.shuffleArray(sample);
            expect(result).toHaveLength(sample.length);
        });

        test('returned array has all of the values still', () => {
            const result = general.shuffleArray(sample);
            expect(result).toEqual(expect.arrayContaining(sample));
        });

        test('array is not mutated', () => {
            const monitor = {
                set: jest.fn()
            };
            const proxy = new Proxy(sample, monitor);
            general.shuffleArray(proxy);
            expect(monitor.set).not.toHaveBeenCalled();
        });
    });

    describe('stripIndentsExtra', () => {
        test('strips indents with an escaped newline', () => {
            const testString = general.stripIndentsExtra`
                line 1 \
                line 2 \
                line 3
            `;

            expect(testString).toEqual('line 1 line 2 line 3');
        });
    });
});
