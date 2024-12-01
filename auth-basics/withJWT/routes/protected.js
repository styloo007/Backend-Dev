const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

router.get('/',verifyToken, (req,res) =>{
    res.status(200).json({message: 'Hello, user with ID: ${req.userID'});
} );

module.exports = router;