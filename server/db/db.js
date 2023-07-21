const Pool = require('pg').Pool
const pool = new Pool({
  user: 'carolinerobbins',
  host: '3.86.195.247',
  database: 'reviews',
  password: 'password',
  port: '5432',
})

pool.on('connect', () => {
  console.log('Database pool connected!');
});

pool.on('error', (err) => {
  console.error('Error connecting to the database:', err);
});

 module.exports=pool;
