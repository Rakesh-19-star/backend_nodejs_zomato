const Firm = require("../models/Firm");
const Vendor = require("../models/Vendor");
const verifyToken = require("../middleware/verifyToken");
const multer = require("multer");

const path = require("path"); // Import path for file handling
// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/"); // Ensure this folder exists in your project
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname)); // Use the original file extension
    }
}); 
// Multer upload instance
// This instance will handle file uploads with the specified storage configuration
const upload = multer({ storage: storage });     
// Middleware to handle file uploads
const addFirm = async (req, res) => {
   
    try{
        const {firmName,area,category,region,offer} = req.body;
        const image = req.file? req.file.path : undefined; // Get the uploaded file path 
        const vendor=await Vendor.findById(req.vendorId);// Get the vendor ID from the request 
        if(!vendor){
            return res.status(404).json({message:"Vendor not found"}); 
        }   
        const firm =new Firm({firmName,area,category,region,offer,image,vendor:vendor._id});// Create a new Firm instance with the provided data 
        // Associate the firm with the vendor by setting the vendor field in the Firm schema
        // Add the firm to the vendor's firm array
    
        
       const savedFirm= await firm.save(); 
        vendor.firm.push(savedFirm._id); // Add the firm ID to the vendor's firm array
               return res.status(201).json({message:"Firm added successfully",firm}); // Return a success response with the created firm

    }catch(error){
        console.error("Error adding firm:", error);
        return res.status(500).json({message:"Error adding firm",error:error.message}); // Return an error response

    }

   


}
const deleteFirmById = async (req, res) => {
    try {
        const firmId = req.params.firmId; // Get the firm ID from the request parameters
        const firm = await Firm.findByIdAndDelete(firmId); // Find and delete the firm by ID
        if (!firm) {
            return res.status(404).json({ message: "Firm not found" });
            console .error("Firm not found");
        }   
    }catch(error){
        console.error("Error deleting firm:", error);
        return res.status(500).json({ message: "Error deleting firm", error: error.message }); // Return an error response
    }
}

module.exports = {
    addFirm:  [upload .single('image'),addFirm,],deleteFirmById
   // Export the multer upload middleware for handling single file uploads with the field name 'image'
} 
// Export the addFirm function and the multer upload middleware
// The addFirm function handles the logic for adding a new firm, including file upload handling using multer. It expects the request body to contain firm details and the uploaded image file. The function saves the firm to the database and associates it with the vendor. If successful, it returns a success response; otherwise, it returns an error response.
  