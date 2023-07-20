const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.PGUSER,
  host: 44.202.139.53,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
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