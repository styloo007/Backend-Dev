const {verifyToken} = require('../utils/jwtUtils');

const authMiddleWare = (req,res,next) =>{
    const token = req.header('Authorization')?.split(' ')[1];
    if(!token){
        return res.status(401).json({message: 'Access Denied'});
    }
    try{
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    }
    catch(err){
        console.error(`${err.message}`);
        return res.status(400).json({message: 'Invalid Token'});
    };
};

module.exports = authMiddleWare;