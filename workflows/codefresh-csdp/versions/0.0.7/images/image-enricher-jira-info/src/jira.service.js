const configuration = require('./configuration');
const codefreshApi = require('./codefresh.api');

const JiraClient = require('jira-connector');
const CodefreshJiraClient = require('./CodefreshJiraClient');

class JiraService {

    async init() {
        if (configuration.jira.context) {
            const jiraContext = await codefreshApi.getJiraContext(configuration.jira.context);
            if (!jiraContext) {
                throw new Error(`Codefresh jira integration \"configuration.jira.context\" not found`)
            }
            if (jiraContext.spec.data.auth.type === 'addon') {
                this.jira = new CodefreshJiraClient(configuration.jira.context);
                return;
            }

            const url = jiraContext.spec.data.auth.apiURL;
            const { hostname } = new URL(url);
            configuration.jira = {
                host: hostname,
                basic_auth: {
                    email: jiraContext.spec.data.auth.username,
                    api_token: jiraContext.spec.data.auth.password
                },
                context: configuration.jira.context,
            }
        }

        this.jira = new JiraClient({
            ... configuration.jira
        })

    }

    extract() {
        return new RegExp(`${configuration.projectName}-\\d*`, 'i').exec(configuration.message);
    }

    getInfoAboutIssue(issue) {
        return this.jira.issue.getIssue({
                issueKey: issue
            });
    }

}

module.exports = new JiraService();
