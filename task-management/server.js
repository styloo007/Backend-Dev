require('dotenv').config();

const express = require('express');
const taskRoutes = require('./routes/taskRoutes')

const mongoose = require('mongoose');
const mongo_URI = process.env.MONGO_URI;

const PORT = process.env.PORT;


const app = express();



app.use(express.json());

app.use('/api/tasks',taskRoutes);

const connectDB = async() =>{
    try{
        await mongoose.connect(mongo_URI);
        console.log("MongoDB Connection Successful");
        app.listen(PORT, ()=>{
            console.log("Server  Running at http://localhost:3000");
        })
    }
    catch(error){
        console.error(`Error Connecting MongoDB:  ${error.message}`);
        process.exit(1);
    }
};

connectDB();
