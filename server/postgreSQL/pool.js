require('dotenv').config()
const { Pool } = require('pg')

module.exports = () => {
    console.log('Connecting to PostgreSQL...')
    return new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 20,
        connectionTimeoutMillis: 0,
        idleTimeoutMillis: 0,
        ssl: {
            rejectUnauthorized: false
        }
    })
}

