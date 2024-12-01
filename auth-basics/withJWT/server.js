require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');


const mongo_uri = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());

const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');



app.use('/register',registerRoute);
app.use('/login',loginRoute);

const connectDB = async() =>{
    try{
        mongoose.connect(mongo_uri);
        console.log(`MongoDB connection Successful`);
        app.listen(PORT, () =>{
            console.log(`Server Running at http://localhost:${PORT}`);
        } )
        
    }
    catch(err){
        console.error(`Error Connecting to MongoDB: ${err.message}`);

    }
};

connectDB();




