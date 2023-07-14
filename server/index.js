require('dotenv').config()
const express = require('express');
const app = express();
const router = require("./routes/routes");
const path = require('path');
const cors = require('cors');


app.use(cors());;
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));
app.use("/reviews", router);


app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`)
})

module.exports = app;