require('dotenv').config()

const environment = process.env.ENV
const config = require('../knexfile.js');
console.log(environment)
console.log(config)
module.exports = require('knex')(config);