module.exports = {
    apiToken: process.env.CF_API_KEY?.trim(),
    commitsByUserLimit: process.env.CF_COMMITS_BY_USER_LIMIT?.trim() || 5,
    host: process.env.CF_URL?.trim() || 'https://g.codefresh.io',
    githubHost: process.env.GITHUB_HOST?.trim() || 'github.com',
    image: process.env.IMAGE_SHA?.trim(),
    branch: process.env.BRANCH?.trim(),
    repo: process.env.REPO?.trim(),
    githubToken: process.env.GITHUB_TOKEN?.trim(),
    workingDirectory: process.env.WORKING_DIRECTORY?.trim() || '/codefresh/volume',
    contextName: process.env.GIT_PROVIDER_NAME?.trim(),
    githubAPI: process.env.GITHUB_API?.trim(),
    apiPathPrefix: process.env.API_PATH_PREFIX?.trim(),


    // setup these variables during init phase
    contextType: '',
    contextCreds: '',
};
