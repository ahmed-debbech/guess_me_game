// Update with your config settings.
require('dotenv').config()

if(process.env.ENV == 'prod'){
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
}
if(process.env.ENV == 'dev'){
    module.exports = {
        client: 'pg',
        connection: {
                database: process.env.PROD_DATABASE_NAME,
            port: process.env.PROD_DATABASE_PORT,
            host: process.env.PROD_DATABASE_HOST,
            user: process.env.PROD_DATABASE_USER,
            password: process.env.PROD_DATABASE_PASSWORD,
            ssl: {
                    rejectUnauthorized: false
                }
        },
        pool: {
                min: 2,
            max: 10,
        },
        migrations: {
                tableName: 'knex_migrations',
        }
    };
}