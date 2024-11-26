require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const mongo_uri = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());

const connectMongoDB = async() => {
    try{
        mongoose.connect(mongo_uri);
        console.log("MongoDB Connection Successful");
        app.listen(PORT, () =>{
            console.log("Server Running @ http://localhost:3000");
        } );
    }
    catch(error){
        console.error(`Error Connecting MongoDB ${error.message} `);
    }
};

connectMongoDB();

const userSchema = new mongoose.Schema({
    fullname: {type:String},
    username: {type: String, required:true, unique:true},
    password: {type:String, required:true}
})

const User = mongoose.model('User', userSchema);


const validatePassword = (text) =>{
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$/;
    if(!text){
        return "Password Cannot be empty";
    }

    if(text.length<=8){
        return "Password Must be atleast 8 Characters Long";
    }
    const isValid = regex.test(text);
    
    if(!isValid){
        return "Password must contain at least one number, one lowercase letter, one uppercase letter, and one special character";
    }

    return "Password is Valid";
};

app.post('/register', async(req,res) =>{
    const {fullname, username, password} = req.body;
    try{
        const userAlreadyExists = await User.findOne({username});
        if(userAlreadyExists){
            return res.status(401).json({message: 'User Already Exists, Please Login or Try with a different Username'});
        }
        const isValidPass = validatePassword(password);
        console.log(isValidPass);
        if(isValidPass!="Password is Valid"){
            return res.status(401).json({message :isValidPass});
        }
        const newUser = new User({fullname,username,password});
        await newUser.save();
        res.status(200).json({message: 'New User Created Successfully'});
    }

    catch(error){
        console.error(`Error Registering User`);
    }
} );


app.post('/login', async(req,res) =>{
    const {fullname, username, password}  = req.body;
    try{
        const user = User.findOne({username});
        if(!user || user.password!==password){
            return res.status(401).json({message :'Invalid Username or Password'});
        }
        res.status(200).json({message: 'Login Successful'});
    }
    catch(error){
        console.error(`Internal Server Error`);
    }
} );