require('dotenv').config({ path:'../.env'})
const { path } = require('express/lib/application');
const mongoose = require('mongoose')


const mongoURI = process.env.mongo_URI;


const connectDB  = async() =>{
    try{
        await mongoose.connect(mongoURI);
        console.log("MongoDB Connection Successful");

    }

    catch(error){
        console.error(`MongoDB Connection Failed ${error.message}`);
        process.exit(1);
    }
};


connectDB();