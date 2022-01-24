module.exports = {
development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
    filename: './data/sqlite1.db3'
    }
},
production: {
    client: 'postgresql',
    connection: {
        database: process.env.DATABASE_NAME,
        port: process.env.DATABASE_PORT,
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
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
    directory: './migrations'
    }
}
};