// productRoutes.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Route to display the list of products
router.get("/", productController.getAllProducts);

// Route to display a single product by ID
router.get("/product/:id", productController.getProductById);

// Route to create a new product
router.post("/products", productController.createProduct);

// Route to update an existing product by ID
router.put("/products/:id", productController.updateProduct);

// Route to delete a product by ID
router.delete("/products/:id", productController.deleteProduct);

module.exports = router;
