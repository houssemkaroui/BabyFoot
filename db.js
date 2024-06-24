const { Pool } = require('pg');

const pool = new Pool({
  user: 'myuser',      
  host: 'localhost',     
  database: 'babyfoot',
  password: 'mypassword',
  port: 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
  } else {
    console.log('Connected to the database');
  }
  release();
});

module.exports = pool;
