const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // In the master process, create worker processes
  console.log(`Master ${process.pid} is running`);

  // Fork workers based on the number of CPU cores
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Handle worker exit and respawn if needed
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  // In worker processes, create and run the Express app
  const express = require('express');
  const app = express();
  const router = require("./routes/routes");
  const path = require('path');
  const cors = require('cors');

  app.use(cors());
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '../dist')));
  app.use("/reviews", router);

  app.listen(3001, () => {
    console.log(`Worker ${process.pid} is listening on port 3001`);
  });
}
