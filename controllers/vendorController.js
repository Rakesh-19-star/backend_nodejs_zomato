const Vendor = require("../models/Vendor");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotEnv=require("dotenv");
dotEnv.config(); 
const secretKey = process.env.WhatIsYourName; // Use the environment variable for the secret key

const venderRegister = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ message: "Vendor already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newVendor = new Vendor({
      username,
      email,
      password: hashedPassword,
    });
  

    await newVendor.save();
    res.status(201).json({ message: "Vendor registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering vendor", error: error.message });
    console.error("Error registering vendor:", error); // Log the error for debugging
  } 
};

const venderLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(400).json({ message: "Vendor not found" });
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    const token =jwt.sign({vendorId:vendor._id}, secretKey, { expiresIn: '1h' });
    


    res.status(200).json({ message: "Vendor logged in successfully" ,token});
    console.log("Vendor logged in successfully",token);
  } catch (error) {
    res.status(500).json({ message: "Error logging in vendor", error: error.message });
    console.error("Error logging in vendor:", error); 
  }
  
};

const getAllVendors = async (req, res) => {
  try{
    const vendors=await Vendor.find().populate("firm")
    res.json({vendors});
    console

  }catch(error)
{
    res.status(500).json({message:"Error fetching vendors",error:error.message});
    console.error("Error fetching vendors:", error);
  

}}

const getVendorById=async(req,res)=>{
  
  try{
    const vendorId=req.params.id;
    const vendor=await Vendor.findById(vendorId)
    if(!vendor){
      return res.status(404).json({message:"Vendor not found"});
    }
    res.status(200).json({vendor});
  }catch(error){
    res.status(500).json({message:"Error fetching vendor",error:error.message});
    console.error("Error fetching vendor:", error); 

  }
}

module.exports = { venderRegister, venderLogin,getAllVendors, getVendorById };
