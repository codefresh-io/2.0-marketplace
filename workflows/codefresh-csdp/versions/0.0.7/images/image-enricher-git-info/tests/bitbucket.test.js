const file = require('../src/pull-request/bitbucket/file');

test('should be able retrieve prs from bitbucket event file', async () => {
  const prs = await file.pullRequests();
  const pr  = {"number":3,"title":"v4","url":"https://bitbucket.org/vadpasseka/iremember/pull-requests/3"};
  expect(prs[0]).toStrictEqual(pr);
});
