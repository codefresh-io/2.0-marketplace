const strategy = require('../strategy');
const path = require('path');

test('should retrieve github strategy because of file', async () => {
  const provider = await strategy.getProvider(path.resolve('./src/pull-request/tests/event.json'));
  expect(provider.file.__proto__.constructor.name).toBe('GithubFile');
});

test('should retrieve github strategy because file not found', async () => {
  const provider = await strategy.getProvider(path.resolve('./unknown'));
  expect(provider.file.__proto__.constructor.name).toBe('BitbucketFile');
});
