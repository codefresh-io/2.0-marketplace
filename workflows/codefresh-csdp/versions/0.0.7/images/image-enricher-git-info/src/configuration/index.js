const Joi = require('joi')
const _ = require('lodash')

const providers = {
    GITHUB: 'github',
    BITBUCKET: 'bitbucket',
    GITLAB: 'gitlab'
}

const inputs = {
    provider: process.env.GIT_PROVIDER?.trim(),
    cfRuntime: process.env.CF_RUNTIME?.trim(),
    cfHost: process.env.CF_HOST_URL?.trim() || 'https://g.codefresh.io',
    cfApiKey: process.env.CF_API_KEY?.trim(),
    imageName: process.env.IMAGE_NAME?.trim(),
    imageDigest: process.env.IMAGE_SHA?.trim(),
    repo: process.env.REPO?.trim(),
    branch: process.env.BRANCH?.trim(),

    // github
    githubApiHost: process.env.GITHUB_API_HOST_URL?.trim() || 'https://api.github.com',
    githubToken: process.env.GITHUB_TOKEN?.trim(),
    githubApiPathPrefix: process.env.GITHUB_API_PATH_PREFIX?.trim() || '/',
    githubContextName: process.env.GITHUB_CONTEXT?.trim(),

    commitsByUserLimit: Number(process.env.CF_COMMITS_BY_USER_LIMIT?.trim()) || 5,
};

const schema = Joi.object({
    GIT_PROVIDER: Joi.string().valid(...Object.values(providers)).required(),
    CF_RUNTIME: Joi.string(),
    CF_HOST_URL: Joi.string().uri(),
    CF_API_KEY: Joi.string().required(),
    IMAGE_NAME: Joi.string().required(),
    IMAGE_SHA: Joi.string().required(),
    REPO: Joi.string().required(),
    BRANCH: Joi.string().required(),

    // others
    CF_COMMITS_BY_USER_LIMIT: Joi.number(),
})
.when(Joi.object({ GIT_PROVIDER: Joi.valid(providers.GITHUB) }).unknown(), {
    then: Joi.object({
        GITHUB_API_HOST_URL: Joi.string().uri(),
        GITHUB_TOKEN: Joi.string(),
        GITHUB_API_PATH_PREFIX: Joi.string().uri({ relativeOnly: true }),
        GITHUB_CONTEXT: Joi.string(),
    }).xor('GITHUB_CONTEXT', 'GITHUB_TOKEN')
});

module.exports = {
    inputs,

    providers,

    validateInputs() {
        const { error } = schema.validate(process.env, { allowUnknown: true });
        return [ error, this.inputs ];
    }
}
