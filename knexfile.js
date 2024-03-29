if (process.env.NODE_ENV !== 'production') require('dotenv').config()

let url = require('url')
let db_url = url.parse(process.env.DATABASE_URL)

let host = db_url.host.substr(0, db_url.host.indexOf(':'))
let user = db_url.auth.substr(0, db_url.auth.indexOf(':'))
let pass = db_url.auth.substr(db_url.auth.indexOf(':') + 1, db_url.auth.length)
let db = db_url.path.substr(1)

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: host,
      user: user,
      password: pass,
      database: db,
      ssl: process.env.SSL_ON === '1' ? true : false,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
  production: {
    client: 'pg',
    connection: {
      host: host,
      user: user,
      password: pass,
      database: db,
      ssl: process.env.SSL_ON === '1' ? true : false,
    },
    pool: {
      min: 1,
      max: 2,
      acquireTimeoutMillis: 10000,
      createTimeoutMillis: 10000,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
}
