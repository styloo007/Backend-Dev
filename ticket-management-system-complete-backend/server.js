const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const {connectRedis} = require('./config/redis');

connectDB();
connectRedis();

const app = express();
app.use(express.json());

app.use('/api/auth', require('./routes/userRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server Running at http://localhost:${PORT}`);
});


