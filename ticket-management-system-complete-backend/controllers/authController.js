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


exports.addUser = async(req,res) =>{
    try{
        const existingUser = await User.findOne({email:req.body.email});
        if(existingUser){
            return res.status(400).json({message: 'User Already Exists'});
        }
        const newUser = await User(req.body);
        await newUser.save();
        return res.status(201).json({message: 'User Added Successfully', 'User':newUser});
    }
    catch(err){
        console.error(`Error Adding New User: ${err.message}`);
        return res.status(500).json({message: 'Internal Server Error'});
    }
};


exports.deleteUser = async(req,res)  =>{
    try{

        const email = req.body.email;
        if(!email){
            return res.status(400).json({message: 'Email is Required'});
        };

        const user = await User.findOneAndDelete({email});
        
        if(!user){
            return res.status(404).json({message: 'User Does Not Exist'});
        }

        await user.deleteOne();
        return res.status(200).json({message: 'User Deleted Successfully'}); 
    }
    catch(err){
        console.error(`Error Deleting User: ${err.message}`);
        return res.status(500).json({message: 'Internal Server Error'});
    }
}