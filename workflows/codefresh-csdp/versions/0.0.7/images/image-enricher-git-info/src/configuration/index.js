const prod = require('./prod');
const test = require('./test');

module.exports = process.env.NODE_ENV === 'test' ? test: prod;
