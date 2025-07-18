const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const vendorRoutes = require("./routes/vendorRoutes");
const firmRoutes = require("./routes/firmRoutes");  
const  productRoutes=require('./routes/productRoutes')
const cors = require("cors");

const corsOptions = {
  origin: "*", // Or specify: "http://localhost:3000"
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};


dotenv.config();
const app = express();
const PORT = process.env.PORT||4000;

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/vendor", vendorRoutes);
app.use("/firm", firmRoutes);  // Use the firmRoutes for handling firm-related requests
app.use('/products',productRoutes)
app.use("/uploads", express.static("uploads")); // Serve static files from the uploads directory  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
app.get("/", (req, res) => res.send("Welcome to Zomato backend"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connected successfully");
   
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
