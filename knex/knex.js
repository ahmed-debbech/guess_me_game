const environment = process.env.ENVIRONMENT || 'dev'
const config = require('../knexfile.js');
console.log(config);
module.exports = require('knex')(config);