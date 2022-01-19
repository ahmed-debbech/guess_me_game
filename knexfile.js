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
    database: process.env.DATABASE_URL,
    port: process.env.DATABASE_PORT,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_ACCESS_KEY,
    },
    pool: {
    min: 2,
    max: 10
    },
    ssl: {
        rejectUnauthorized: false
      },
    migrations: {
    tableName: 'knex_migrations',
    directory: './migrations'
    }
}
};