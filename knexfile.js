// Update with your config settings.
require('dotenv').config()

module.exports = {
  client: 'pg',
  connection: {
    database: 'wordrace',
    user:     'postgres',
    password: 'postgres'
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};
