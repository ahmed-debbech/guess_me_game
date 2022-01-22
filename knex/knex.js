const environment = process.env.ENVIRONMENT || 'development'
const config = require('../knexfile.js')[environment];
console.log(config.client);
module.exports = require('knex')(config);