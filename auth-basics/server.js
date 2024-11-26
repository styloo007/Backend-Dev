require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const mongo_uri = process.env.MONGO_URI;
const PORT = process.env.PORT;

const connectDB = async () =>{
    try{
        mongoose.connect(mongo_uri);
        console.log("MongoDB Connection Successful");
        app.listen(PORT, ()=>{
            console.log("Server Running at http://localhost:3000");
        })

    }
    catch(error){
        console.error(`Error Connecting to DB ${error.message}`);
    }
};

connectDB();


const userSchema = new mongoose.Schema({
    username: {type: String, required:true, unique:true},
    password: {type:String, required:true}
});

const User = mongoose.model('User', userSchema);

app.post('/register', async(req,res) =>{
    const {username,password} = req.body;
    try{
        const newUser = new User({username, password});
        await newUser.save();
        res.status(200).json({message: 'User Created Successfully'});
    }
    catch(error){
        res.status(400).json({message: 'Error Registering User'})
    }
} );


app.post('/login', async(req,res) =>{
    const {username,password} = req.body;
    try{
        const user = await User.findOne({username});
        if(!user || user.password!==password){
            return res.status(401).json({message: 'Invalid Username or Password'});
        }
        res.status(200).json({message: 'Login Succesful'});
    }
    catch(error){
        return res.status(500).json({message: 'Internal Server Error'})
    }

});



