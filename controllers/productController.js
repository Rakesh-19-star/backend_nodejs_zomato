const Product = require("../models/Product");
const Firm = require("../models/Firm");     
const multer = require("multer");
const path = require("path"); // <-- Add this

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/"); // Make sure this folder exists
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Multer upload instance
const upload = multer({ storage: storage });

const addProduct = async (req, res) => {
   try {
    const { productName, price, category, bestSeller, description, } = req.body;
    const firmId = req.params.firmId; // Get the firm ID from the request parameters
    const image = req.file ? req.file.path : undefined; // Get the uploaded file path
    const firm = await Firm.findById(firmId); // Find the firm by ID
    if (!firm) {
        console.log("Firm not found");
        return res.status(404).json({ message: "firm not found" });
    }
    const product = new Product({
        productName,
        price,
        category,
        image,
        bestSeller,
        description,
        firm: firmId // Associate the product with the firm
    });
    console.log(req.body);
    console.log("Firm found:", firm);
    console.log("Product details:", product);       
    console.log(req.params)
    const savedProduct = await product.save(); 
    
    await product.save(); // Save the updated product document  
    firm.products.push(savedProduct._id); 
    await firm.save(); // Save the updated firm document
    // Add the product ID to the firm's products array            
   
    product.firm.push(firm._id); // Add the firm ID to the product's firm array

// Save the product to the database
   
    
    return res.status(201).json({ message: "Product added successfully", product: savedProduct });  
    console.log("Product added successfully:", savedProduct);
          
    console.log("Product saved:", savedProduct);
    console.log("Firm updated with new product:", firm);        
   
   } catch (error) {
    console.error("Error adding product:", error);
    return res.status(500).json({ message: "Error adding product", error: error.message });
   }
}
const getProductByFirm=async (req, res) => {
    try{
        const firmId=req.params.firmId; 
        const firm =await Firm.findById(firmId).populate("products");
        if(!firm){
            return res.status(404).json({message:"Firm not found"});
        }   
        const restaurantName=firm.firmName
        const products=await Product.find({ firm: firmId });
        return res.status(200).json({restaurantName,products}); // Return the products associated with the firm    

    }catch(error){
        console.error("Error fetching products by firm:", error);
        return res.status(500).json({ message: "Error fetching products", error: error.message });  
    }
}

const deleteProductById=async(req,res)=>{
    try{

        const productId=req.params.productId;
        const deletedProduct=await Product.findByIdAndDelete(productId);
        if(!deletedProduct){
            return res.status(404).json({message:"Product not found"});
            console.log("Product not found");
        }
        await Firm.updateMany(
            {products: productId}, // Find firms that have this product
            { $pull: { products: productId } } // Remove the product ID from the products array
        ) 
        return res.status(200).json({ message: "Product deleted successfully" });
        console.log("Product deleted successfully:", deletedProduct); // Log the deleted product details    
    }
    catch(error){
        console.error("Error deleting product:", error);
        return res.status(500).json({ message: "Error deleting product", error: error.message });   

    }
}


module.exports = { addProduct: [upload.single("image"), addProduct],getProductByFirm,deleteProductById};