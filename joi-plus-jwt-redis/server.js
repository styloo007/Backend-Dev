require('dotenv').config('.env');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000 ;
console.log(`PORT : ${PORT}`)
app.use(express.json());

const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');


app.use('/auth', authRoutes);

connectDB();

app.listen(PORT, ()=>{
    console.log(`Server Running at http://localhost:${PORT}`);
})

