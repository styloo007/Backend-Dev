require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

const connectDB = () =>{
    try{
        mongoose.connect(MONGO_URI);
        console.log(`MongoDB Connection Successful`);
    }

    catch(err){
        console.error(`Error Connecting MongoDB: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;