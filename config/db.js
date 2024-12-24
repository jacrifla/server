const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

module.exports = pool;

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error(`Erro na consulta: ${err.message}`);
    } else {
        console.log(`Hora atual: ${res.rows[0].now}`);
    }
});