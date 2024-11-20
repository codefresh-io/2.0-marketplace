const initializer = require('../initializer');
const config = require('../configuration');

jest.mock('request-promise', () => {
    return () => {
        return Promise.resolve({
            spec: {
                type: 'git.github',
                data: {
                    auth: {
                        password: 'password',
                    }
                }
            }
        });
    };
});

test('should retrieve context from server and put it as part of config', async () => {
    await initializer._prepareConfig();

    expect(config.baseUrl).toBe('https://api.github.com');
    expect(config.contextType).toBe('git.github');
    expect(config.contextCreds).toBe('password');

});
