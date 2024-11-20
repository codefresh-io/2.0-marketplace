const chalk = require('chalk');

class Gitlab {

    async pullRequests() {
        console.log(chalk.yellow(`Gitlab currently not support for non pr merge event triggers. `));
        return [];
    }
}
module.exports = new Gitlab();
