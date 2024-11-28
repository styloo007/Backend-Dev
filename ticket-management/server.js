require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodeMailer = require('nodemailer');

const mongo_uri = process.env.MONGO_URI;
const PORT = process.env.PORT;

const ticketmgmt = require('./routes/ticket-mgmt');
const usermgmt = require('./routes/user-mgmt');

const app = express();
app.use(bodyParser.json());


app.use('/api/tickets',ticketmgmt);
app.use('/api/users',usermgmt);

const connectDB = () => {
    try{
        mongoose.connect(mongo_uri);
        console.log(`MongoDB Connection Successful`);
        app.listen(PORT, () =>{
            console.log(`Server Running at http://localhost:${PORT}`);
        } );
    }
    catch(error){
        console.error(`Error Connecting to MongoDB ${error.message}`);
        process.exit(1);
    }
};

connectDB();

