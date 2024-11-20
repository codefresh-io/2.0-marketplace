const Exec = require('child_process').exec;

class VariableExporter {
    export(key, value) {
        return new Promise((res, rej) => {
            Exec(`echo ${key}=${value} >> /codefresh/volume/env_vars_to_export`, (err) => {
                if (err) {
                    rej(new Error(`Fail to set export variable, cause: ${err.message}`));
                }

                res();
            });
        });
    }
}
module.exports = new VariableExporter();
