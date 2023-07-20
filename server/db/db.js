const Pool = require('pg').Pool
const pool = new Pool({
  user: 'carolinerobbins',
  host: '44.205.248.108',
  database: 'reviews',
  password: 'password',
  port: '3001',
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