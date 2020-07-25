const express = require("express");
const path = require("path");
const photosRouter = require("./routers/photos");
const connectDB = require("./db/connection");

const cors = require('cors')
const corsOptions = {
  origin: 'http://ec2-3-134-253-238.us-east-2.compute.amazonaws.com',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

const app = express();
const PORT = process.env.PORT || 3300;

//call to DB
connectDB();

app.use(express.static(path.join(__dirname, "..", "build")));
app.use(photosRouter);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
