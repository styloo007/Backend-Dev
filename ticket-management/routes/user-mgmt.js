const express = require('express');
const mongoose = require('mongoose');
const User =  require('../models/user');
const bcrypt = require('bcryptjs');
const router=express.Router();

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


router.post('/register', async(req,res) =>{
    const {fullname, email,password, role} = req.body;
    try{
        if(!fullname){
            return res.status(401).json({message: 'Name is Required'});
        }

        if(!email){
            return res.status(401).json({message: 'Email is Required'});
        }
        const emailExists = await User.findOne({email});
        if(emailExists){
            return res.status(401).json({message: 'User With This Email Already Exists'});
        }
        const isPassValid = await validatePassword(password);
        if(isPassValid!=="Password is Valid"){
            return res.status(400).json({message: isPassValid});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({fullname, email, password:hashedPassword, role});
        await newUser.save();
        return res.status(200).json({message: 'User Registration Successful',newUser});
    }
    catch(error){
        console.error(`Error Registering User ${error.message} `);
        return res.status(500).json({message: 'Internal Server Error'});
    }
} );


router.post('/login', async(req,res) =>{
    const {email, password} = req.body;
    console.log(email);
    console.log(password);
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: 'User Does Not Exist, Please Register and Try Again'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        
        if(!isMatch){
            return res.status(400).json({message: 'Invalid Credentials'});
        }
        return res.status(200).json({message: 'Login Successful', user});

    }
    catch(error){
        console.error(`Error Logging User in`);
        return res.status(500).json({message: 'Internal Server Error'});
    }
} );

module.exports=router;