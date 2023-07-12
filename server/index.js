require('dotenv').config()
const express = require('express');
const app = express();
const router = require("./routes/routes");

app.use(express.json());
app.use("/reviews", router);

app.listen(port, () => {
  console.log(`Listening on port ${process.env.PORT}`)
})