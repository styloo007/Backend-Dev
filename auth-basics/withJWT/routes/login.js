const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs/dist/bcrypt');
const jwt = require('jsonwebtoken');




router.post('/', async(req,res) =>{
    const{email,password} = req.body;
    try{
        if(!email){
            return res.status(400).json({message: 'Email is Required'});
        }

        if(!password){
            return res.status(400).json({message: 'Password is Required'});
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({message: 'User does not exist'});
        }

        isPassValid = await bcrypt.compare(password, user.password);
        
        if(!isPassValid){
            return res.status(500).json({message: 'Invalid Credentials'});
        }

        const token = jwt.sign(
            {id: user._id, email:user.email},
            process.env.JWT_SECRET,
            {expiresIn:process.env.JWT_EXPIRES_IN}
        );

        return res.status(200).json({message: 'Login Successful', token});
    }
    catch(err){
        console.error(`Error Logging In user: ${err.message}`);
        return res.status(500).json({error: 'Internal Server Erorr'});
    }
} );


module.exports = router;