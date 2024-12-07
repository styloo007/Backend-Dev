require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const redis = require('redis');
const joi = require('joi');

const User = require('../models/user');

const router = express.Router();


const registerSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
        .required()
        .message({
            "string.pattern.base":"Password must be atleast 8 characters long, include an uppercase, a lower case, a number and a special character",
        })
});

const loginSchema = joi.object({
    email:joi.string().email().required(),
    password: joi.string().required(),
});


router.post('/register', async(req,res) => {
    const {error } = registerSchema.validate(req.body);
    if(error){
        return res.status(400).json({message: error.details[0].message});
    }
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: 'User Already Exists'});
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const newUser = new User({email, password:hashedPass});
        await newUser.save();

        return res.status(201).json({message: 'User Registered Successfully', newUser});
    }
    catch(err){
        console.error(`Error Registering User: ${err.message}`);
        return res.status(500).json({error: 'Internal Server Error'});
    }
} );


router.post('/login', async(req,res) =>{
    const {error} = loginSchema.validate(req.body);
    if(error){
        return res.status(400).json({message: error.details[0].message});
    }
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: 'User Not Found'});
        }

        const isPassCorrect = await bcrypt.compare(password, user.password);
        if(!isPassCorrect){
            return res.status(400).json({message: 'Invalid Credentials'});
        }
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET,{EXPIRES_IN: process.env.JWT_EXPIRES_IN});

        return res.status(201).json({message: 'Login Successful',token});
    }
    catch(err){
        console.error(`Error Logging In: ${err.message}`);
        return res.status(500).json({error: 'Internal Server Error'});
    }

} );

module.exports = router;
