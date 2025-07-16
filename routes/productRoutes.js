const express= require("express");
const router = express.Router();            
const { addProduct ,getProductByFirm,deleteProductById} = require("../controllers/productController");

router.post("/add-product/:firmId", addProduct); // Route to add a new product
router.get("/:firmId/products", getProductByFirm); // Route to get products by firm ID  
router.delete("/:productId", deleteProductById); // Route to delete a product by ID  
router.get("/uploads/:imageName", (req, res) => {
    const imageName = req.params.imageName; // Get the image name from the request parameters
    res.headersSent("content-Type","image/jpeg"); // Set the content type for the response 
    // Construct the full path to the image file
    const imagePath = path.join(__dirname, "../uploads", imageName); // Construct the full path to the image file
    res.sendFile(imagePath); // Send the image file as a response
});
module.exports = router; // Export the router to be used in the main application file