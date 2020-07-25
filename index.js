const express = require("express");
const path = require("path");
const photosRouter = require("./routers/photos");
const connectDB = require("./db/connection");

const cors = require('cors');

//app.use(cors());

const app = express();
const PORT = process.env.PORT || 3300;

//call to DB
connectDB();

app.use(cors())
app.use(photosRouter);

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});