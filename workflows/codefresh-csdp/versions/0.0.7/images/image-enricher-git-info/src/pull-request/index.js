const chalk = require('chalk');

const strategy = require('./strategy');

class PullRequest {

    async get() {
        const { api, file } = await strategy.getProvider();
        try {
            return await file.pullRequests();
        } catch(e) {
            console.log(chalk.yellow(`PRs in event file not found, reason ${e.message}, move to provider api call implementation`));
            return await api.pullRequests();
        }
    }
}
module.exports = new PullRequest();
