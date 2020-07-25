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

app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// app.use(express.static(path.join(__dirname, "..", "build")));
app.use(photosRouter);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
