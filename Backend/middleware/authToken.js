const jwt=require('jsonwebtoken')
require('dotenv').config();


const authToken=async(req,res,next)=>{

    const token = req.header('x-auth-token');

    if(!token){
        return res.status(401).json({msg:'Access denied. No token provided.'})
    }
    
    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded.user;
        next();
    } catch (error) {
        res.status(500).json({msg:"token is not valid"})
        console.log("no token")
    }
}

module.exports=authToken;