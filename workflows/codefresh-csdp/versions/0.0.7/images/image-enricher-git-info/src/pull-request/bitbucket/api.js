const chalk = require('chalk');

class Bitbucket {

    async pullRequests() {
        console.log(chalk.yellow(`Bitbucket currently not support for non pr merge event triggers. `));
        return [];
    }
}
module.exports = new Bitbucket();
