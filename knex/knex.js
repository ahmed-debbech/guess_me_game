const environment = process.env.ENV || 'prod'
const config = require('../knexfile.js');
console.log(environment)
if(environment == 'prod'){
    console.log(config.prod);
    module.exports = require('knex')(config.prod);
}
if(environment == 'dev'){
    console.log(config.dev);
    module.exports = require('knex')(config.dev);
}