const express = require('express')
const app = express()
const dotenv = require('dotenv')
var cors = require('cors')
dotenv.config()
const userRoutes = require('./routes/userRoutes')
require('./db')

app.get('/',(req,res)=>{
    res.json({message:'Welcome'})
})
app.use(cors())
app.use(express.json())
app.use(userRoutes)

module.exports = app