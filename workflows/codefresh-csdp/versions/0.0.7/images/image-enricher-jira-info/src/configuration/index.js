module.exports = {
    apiToken: process.env.CF_API_KEY?.trim(),
    host: process.env.CF_URL?.trim() || 'https://g.codefresh.io',
    projectName: process.env.JIRA_PROJECT_PREFIX?.trim(),
    message: process.env.MESSAGE?.trim(),
    jira: {
        host: process.env.JIRA_HOST?.trim(),
        basic_auth: {
            email: process.env.JIRA_EMAIL?.trim(),
            api_token: process.env.JIRA_API_TOKEN?.trim()
        },
        context: process.env.JIRA_CONTEXT?.trim(),
    },
    image: process.env.IMAGE?.trim(),
    failOnNotFound: process.env.FAIL_ON_NOT_FOUND?.trim()
};
