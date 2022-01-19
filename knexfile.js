module.exports = {
development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
    filename: './data/sqlite.db3'
    }
},
production: {
    client: 'postgresql',
    connection: {
    database: process.env.DATABASE_URL
    },
    pool: {
    min: 2,
    max: 10
    },
    migrations: {
    tableName: 'knex_migrations',
    directory: './migrations'
    }
}
};