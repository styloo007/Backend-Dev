require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000 ;
app.use(express.json());

const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
app.use('/',authRoutes);


connectDB();

app.listen(PORT, () =>{
    console.log(`Server Running at ${PORT}`);
} );



