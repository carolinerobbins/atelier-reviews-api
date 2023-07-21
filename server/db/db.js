const Pool = require('pg').Pool
const pool = new Pool({
  user: 'carolinerobbins',
  host: '3.86.195.247',
  database: 'reviews',
  password: 'password',
  port: '5432',
})

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Database pool connected!');
    release();
  }
});

 module.exports=pool;