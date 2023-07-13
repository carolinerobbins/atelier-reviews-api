require('dotenv').config()
const express = require('express');
const app = express();
const router = require("./routes/routes");

app.use(express.json());
app.use("/reviews", router);

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`)
})

module.exports = app;