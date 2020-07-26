// const { Sequelize } = require('sequelize')
// const sequelize = new Sequelize('postgres://ftqgmobj:cTus75NaFuMmV39hGZvY_jW-iWBDJhpD@rosie.db.elephantsql.com:5432/ftqgmobj')
// sequelize
// .authenticate()
// .then(()=> console.log('database is connected'))
// .catch(err=> console.log(err.message))

// module.exports = sequelize


const { Sequelize } = require("sequelize");

//connecting the app with the postgres sql instance hosted on aws with the elephannt sql platform

const connectDB = new Sequelize(
  "ftqgmobj",
  "ftqgmobj",
  "cTus75NaFuMmV39hGZvY_jW-iWBDJhpD",
  {
    host: "rosie.db.elephantsql.com",
    dialect: "postgres",
  }
);

connectDB.sync()

connectDB
  .authenticate()
  .then(() => {
    console.log(
      "Postgres database has been connected sucessfully");
  })
  .catch((err) => {
    console.error(
      "Connection failed Database not connected  error:",err);
  });
module.exports = connectDB;