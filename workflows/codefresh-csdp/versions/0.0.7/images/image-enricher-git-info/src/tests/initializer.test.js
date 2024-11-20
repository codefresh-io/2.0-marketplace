const initializer = require('../initializer');
const config = require('../configuration');

jest.mock('request-promise', () => {
    return () => {
        return Promise.resolve({
            spec: {
                type: 'git.github',
                data: {
                    auth: {
                        apiPathPrefix: '/v3/',
                        apiHost:'some.host'
                    }
                }
            }
        });
    };
});

test('should correct build baseUrl', async () => {
    await initializer._prepareConfig();

    expect(config.baseUrl).toBe('https://some.host/v3');

});
