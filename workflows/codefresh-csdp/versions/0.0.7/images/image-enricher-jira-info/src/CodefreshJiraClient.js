const codefreshApi = require('./codefresh.api');

class CodefreshJiraClient {
    constructor(context) {
        this.context = context;
        this.issue = {
            getIssue: this.getIssue.bind(this),
        };
    }

    async getIssue({ issueKey }) {
        return codefreshApi.getJiraIssue(this.context, issueKey);
    }
}

module.exports = CodefreshJiraClient;
