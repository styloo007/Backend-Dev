require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');


const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const mongo_uri = process.env.MONGO_URI;
const PORT= process.env.PORT;

const connectToDB = () =>{
    try{
        mongoose.connect(mongo_uri);
        console.log("MongoDB Connection Successful!");
        app.listen(PORT, () =>{
            console.log(`Sever running at http://localhost:${PORT}`);
        } )
    }
    catch(err){
        console.error(`Error Connecting to MongoDB ${err.message} `);
    }
};

connectToDB();

const userSchema = new mongoose.Schema({
    username: {type: String, required:true, unique:true},
    password: {type:String, required:true }
});

const User = mongoose.model('User',userSchema);


const validatePassword = async(text) =>{
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
}


app.post('/register', async(req,res)  =>{
    const {username, password} = req.body;
    try{
        if(!username){
            return res.status(401).json({message: 'Username is Required'});
        }

        if(!password){
            return res.status(400).json({message: 'Password is Required'});
        }

        const userAlreadyExists = await User.findOne({username});
        if(userAlreadyExists){
            return res.status(401).json({message: 'Username Already Exists'});
        }
        const passisValid = await validatePassword(password);
        if(passisValid!=="Password is Valid"){
            return res.status(401).json({message: passisValid});   
        }
        const newUser = new User({username, password});
        await newUser.save();
        return res.status(200).json({message: 'User Registered Successfully'});

    }
    catch(error){
        console.error(`Error Registering User`);
        return res.status(500).json({message: 'Internal Server Error'});
    }

});

app.post('/login', async(req,res) =>{
    const {username, password} = req.body;
    try{
        const user = await User.findOne({username});
        if(!user){
            return res.status(401).json({message: 'User Does not Exist'});
        }

        if(password!=user.password){
            return res.status(401).json({message : 'Wrong Password'})
        }

        return res.status(200).json({message :'Login Successful'});
    }
    catch(error){
        console.error(`Login Failed`);
        return res.status(500).json({message: 'Internal Server Error'});
    }
});

app.post('/forgot-password', async(req,res) =>{
    const {username, newPassword} = req.body;
    try{

        if(!username){
            return res.status(401).json({message : 'Username is required'});
        }

        if(!newPassword){
            return res.status(401).json({message: 'Password is Required'});
        }

        const user = await User.findOne({username});
        if(!user){
            return res.status(401).json({message :'User Not Found'});
        }

        const isPassValid = await validatePassword(newPassword);
        if(isPassValid!="Password is Valid"){
            return res.status(401).json({message: isPassValid});
        }

        user.password = newPassword;
        await user.save();

        return res.status(200).json({message: 'Password Change Success!'});

    }

    catch(error){
        console.error("Error Changing Password");
        return res.status(500).json({message: 'Internal Server Error'});
    }
});

let tempStorage="";

app.post('/forgot-pass', async(req,res) =>{
    const {username} = req.body;
    try{
        user = await User.findOne({username});
        if(!user){
            return res.status(400).json({message: 'User Not Found'});
        }

        generateUniqueID = Math.floor(Math.random() * (9999 - 1000) + 1000);
        tempStorage=generateUniqueID;
        console.log(`Unique ID - ${generateUniqueID} for Username - ${username}`);
        return res.status(200).json({message: 'Unique ID Generated', uniqueID: generateUniqueID});

    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({message: 'Internal Server Error'});
    }
});

app.post('/reset-password', async(req,res) =>{
    const {username, uniqueID, newPassword} = req.body;
    try{
        user = await User.findOne({username});
        if(user){
            console.log(`Unique ID - ${tempStorage}`);
            if(tempStorage==uniqueID){
                user.password = newPassword;
                await user.save();
                tempStorage="";
                return res.status(200).json({message: 'Password Updated Successfully'});
            }
        }

        return res.status(400).json({message: 'Password Could Not be Updated'});
    }

    catch(error){
        console.error(`Error Updating Password!`);
        return res.status(500).json({message: 'Internal Server Error'});
    }
} )