const express = require("express");
const { venderRegister, venderLogin ,getAllVendors,getVendorById} = require("../controllers/vendorController");

const router = express.Router();

router.post("/register", venderRegister);
router.post("/login", venderLogin);
router.get("/all-vendors",getAllVendors);
router.get("/single-vendor/:id", getVendorById);

module.exports = router;
