// productController.js
const fs = require("fs");
const path = require("path");

// Helper function to read and parse JSON file
const readJsonFile = (filePath, callback) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading file from ${filePath}:`, err);
      return callback(err, null);
    }

    try {
      const parsedData = JSON.parse(data);
      callback(null, parsedData);
    } catch (jsonError) {
      console.error(`Error parsing JSON from ${filePath}:`, jsonError);
      callback(jsonError, null);
    }
  });
};

// Helper function to write data to JSON file
const writeJsonFile = (filePath, data, callback) => {
  fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error(`Error writing to file ${filePath}:`, err);
      return callback(err);
    }
    callback(null);
  });
};

// Function to get all products
const getAllProducts = (req, res) => {
  const filePath = path.join(__dirname, "../data/products.json");
  console.log("Loading products from:", filePath);

  readJsonFile(filePath, (err, products) => {
    if (err) {
      return res.status(500).send("Error loading products.");
    }
    res.render("index", { products });
  });
};

// Function to get a product by its ID
const getProductById = (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const filePath = path.join(__dirname, "../data/products.json");

  readJsonFile(filePath, (err, products) => {
    if (err) {
      return res.status(500).send("Error loading products.");
    }

    const product = products.find((p) => p.id === productId);

    if (product) {
      res.render("product", { product });
    } else {
      res.status(404).send("Product not found");
    }
  });
};

// Function to create a new product
const createProduct = (req, res) => {
  const filePath = path.join(__dirname, "../data/products.json");
  const newProduct = req.body;

  readJsonFile(filePath, (err, products) => {
    if (err) {
      return res.status(500).send("Error loading products.");
    }

    newProduct.id = products.length + 1; // Assign a new ID
    products.push(newProduct);

    writeJsonFile(filePath, products, (writeErr) => {
      if (writeErr) {
        return res.status(500).send("Error saving product.");
      }
      res.status(201).json({ success: true, product: newProduct });
    });
  });
};

// Function to update a product by ID
const updateProduct = (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const filePath = path.join(__dirname, "../data/products.json");
  const updatedData = req.body;

  readJsonFile(filePath, (err, products) => {
    if (err) {
      return res.status(500).send("Error loading products.");
    }

    const productIndex = products.findIndex((p) => p.id === productId);
    if (productIndex !== -1) {
      products[productIndex] = { ...products[productIndex], ...updatedData };

      writeJsonFile(filePath, products, (writeErr) => {
        if (writeErr) {
          return res.status(500).send("Error updating product.");
        }
        res.json({ success: true, product: products[productIndex] });
      });
    } else {
      res.status(404).send("Product not found");
    }
  });
};

// Function to delete a product by ID
const deleteProduct = (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const filePath = path.join(__dirname, "../data/products.json");

  readJsonFile(filePath, (err, products) => {
    if (err) {
      return res.status(500).send("Error loading products.");
    }

    const newProducts = products.filter((p) => p.id !== productId);

    writeJsonFile(filePath, newProducts, (writeErr) => {
      if (writeErr) {
        return res.status(500).send("Error deleting product.");
      }
      res.json({ success: true });
    });
  });
};

// Export the functions for use in routes
module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
