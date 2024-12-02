const mongoose = require('mongoose');
require('dotenv').config();
const mongo_uri = process.env.MONGO_URI;
const PORT = process.env.PORT;
const connectDB = async() =>{
    try{
        mongoose.connect(mongo_uri);
        console.log(`MongoDB Connection Successful`);
    }
    catch(err){
        console.error(`Error Connecting MongoDB: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;