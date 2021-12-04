const express = require('express')
const { appendFile } = require('fs')
const path = require('path')
const {Client} = require('pg');
const PORT = process.env.PORT || 5000

const app = express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  client.connect()
  .then(() => console.log('connected to heroku database!'))
  .catch(err => console.error('connection error happend in heroku database :(', err.stack));
