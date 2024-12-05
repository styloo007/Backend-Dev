const User = require('../models/user');
const bcrypt = require('bcryptjs');
const express = require('express');
const {generateToken} = require('../utils/jwtUtils');

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


exports.register = async(req,res) =>{
    const {userName,email,password,role} = req.body;
    try{
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: 'User Already Exists'});
        }

        const isPassValid = await validatePassword(password);
        if(isPassValid!=='Password is Valid'){
            return res.status(400).json({message: isPassValid});
        }

        const newPassword = await bcrypt.hash(password,10);

        const newUser = new User({userName,email,password:newPassword,role});
        await newUser.save();

        return res.status(201).json({message: 'User Registraton Successful', newUser});
    }
    catch(err){
        console.error(`Error Registering User: ${err.message}`);
        return res.status(500).json({message: 'Internal Server Error'});
    };
};

exports.login = async(req,res) =>{
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: 'User Does Not Exist'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: 'Invalid Credentials'});
        }

        const token = generateToken(user);
        return res.status(200).json({message: 'Login Successful', user, token});
    }
    catch(err){
        console.error(`Error Logging User In: ${err.message}`);
        return res.status(500).json({message: 'Internal Server Error'});
    };
};


