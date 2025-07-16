const express=require("express"); 
const firmController=require("../controllers/firmController");
const  verifyToken=require("../middleware/verifyToken"); 
const { deleteFirmById } = require("../controllers/firmController"); 
const router=express.Router();  

router.post("/add-firm",verifyToken, firmController.addFirm);
router.delete("/:firmId", deleteFirmById); // Route to delete a firm by ID
router.get("/uploads/:imageName", (req, res) => {
    const imageName = req.params.imageName; // Get the image name from the request parameters
    res.headersSent("content-Type","image/jpeg"); // Set the content type for the response 
    // Construct the full path to the image file
    const imagePath = path.join(__dirname, "../uploads", imageName); // Construct the full path to the image file
    res.sendFile(imagePath); // Send the image file as a response
});
// Define a route to add a new firm, protected by the verifyToken middleware
module.exports=router;
 
