if(process.env.NODE_ENV !== 'production') require('dotenv').load();

module.exports = {
    development: {
        client: 'pg',
        connection: {
            host     : process.env.DB_HOST,
            user     : process.env.DB_USER,
            password : process.env.DB_USER_PASSWORD,
            database : process.env.DB_NAME
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    },
    production: {
        client: 'pg',
        connection: {
            host     : process.env.DB_HOST,
            user     : process.env.DB_USER,
            password : process.env.DB_USER_PASSWORD,
            database : process.env.DB_NAME,
            ssl: process.env.SSL_ON === 1 ? true : false
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    }
};
