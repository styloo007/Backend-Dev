const express = require('express');
router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/', async(req,res) =>{
    const {email,password} = req.body;
    try{
        if(!email || !password){
            return res.status(400).json({message: 'Email and Password are Required'});
        }

        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: 'User with this Email ID already exists'});
        }
        if(password.length<8){
            return res.status(400).json({message: 'Password should be atleast 8 characters in length'})
        }
        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User({email, password:hashedPassword});
        await newUser.save();
        const token = jwt.sign(
            {id:newUser._id,},
            process.env.JWT_SECRET,
            {expiresIn:'1h'}
        );
        return res.status(200).json({message: 'User Registered Successfully',newUser, token});
    }
    
    catch(err){
        console.error(`Error Registering User: ${err.message}`);
        return res.status(500).json({error: 'Internal Server Error'});
    }
} );

module.exports = router;