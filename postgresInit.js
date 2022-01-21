const { Pool, Client } = require('pg')

module.exports = {
    init
}

function init(){

    /*const pool = new Pool({
        user: process.env.DATABASE_USER,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_URL,
        password: process.env.DATABASE_PASSWORD,
        port: process.env.DATABASE_PORT,
    })
    
    pool.query('SELECT NOW()', (err, res) => {
        console.log(err, res)
        pool.end()
    })*/

    const client = new Client({
        user: process.env.DATABASE_USER,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: process.env.DATABASE_PORT,
        ssl: {
            rejectUnauthorized: false
          }
    })

    client.connect()

    client.query('SELECT NOW()', (err, res) => {
        console.log(err, res)
        client.end()
    })
}