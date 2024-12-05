const {addUser, deleteUser} = require('../controllers/authController');
const express = require('express');
const authMiddleWare = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/addUser',addUser, authMiddleWare, (req,res,next) =>{
    if(req.body.role!=='Admin'){
        return res.status(403).json({message: 'Access Denied'})
    }
    next();
},addUser );


router.delete('/deleteUser',deleteUser, authMiddleWare, (req,res,next) =>{
    if(req.body.role!=='Admin'){
        return res.status(403).json({message: 'Access Denied'});
    }
    next();
},deleteUser );


module.exports = router;