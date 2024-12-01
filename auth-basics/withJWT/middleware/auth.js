const jwt = require('jsonwebtoken');

const verifyToken = async(req,res,next) => {
    const token = req.headers['authorization']?.split('')[1];
    if(!token){
        return res.status(403).json({message: 'No Token Provided'});
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    }
    catch(err){
        console.log(`Error Verifying Tokens: ${err.message}`);
        return res.status(401).json({message: 'Unauthorized'});
    }
};

module.exports = verifyToken;