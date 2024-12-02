require('dotenv').config();
const redis = require('redis');
const client = redis.createClient({url: process.env.REDIS_URL});


client.on('error', (err) =>{
    console.error(`Redis Client Error: ${err.message}`);
});

const connectRedis = async() =>{
    await client.connect();
    console.log(`Redis Connected..`);
};


module.exports = {client, connectRedis};
