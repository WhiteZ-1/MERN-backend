const mongoose = require("mongoose")
require('dotenv').config()

const mongoUri= process.env.MONGODB_URI

const connectToMongoose = ()=>{
    mongoose.connect(mongoUri,()=>{
        console.log("Connected to database")
    })
}

module.exports = connectToMongoose