const Vendor = require("../models/Vendor");
const jwt = require("jsonwebtoken");
const dotEnv = require("dotenv");
dotEnv.config(); 
const secretKey = process.env.WhatIsYourName; // Use the environment variable for the secret key   
const verifyToken = async(req, res, next) =>{
    const token=req.headers.token;
    if(!token){
        return res.status(401).json({message:"token is required"});
      
    }
    try{
        const decoded=jwt.verify(token,secretKey);
        const vendor =await Vendor.findById(decoded.vendorId);
        if(!vendor){
            return res.status(404).json({message:"Vendor not found"});
        }
        req.vendorId=vendor._id;
        next();

    }catch(error){
        console.error("Token verification failed:", error);
        return res.status(401).json({message:"Invalid token"});
  }
} 
module.exports = verifyToken;   

