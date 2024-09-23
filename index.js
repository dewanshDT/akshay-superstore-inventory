// index.js
const express = require("express")
const app = express()
const path = require("path")
const { Sequelize, DataTypes, Op } = require("sequelize")

// Set up SQLite database using Sequelize
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
})

// Define models

// Product Model
const Product = sequelize.define(
  "Product",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    stockQuantity: { type: DataTypes.INTEGER, allowNull: false },
    reorderLevel: { type: DataTypes.INTEGER, allowNull: false },
    maximumStockLevel: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
  },
  {
    indexes: [{ fields: ["name"] }],
  }
)

// Supplier Model
const Supplier = sequelize.define("Supplier", {
  name: { type: DataTypes.STRING, allowNull: false },
  contactInfo: { type: DataTypes.STRING },
})

// Order Model
const Order = sequelize.define("Order", {
  orderDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  orderType: { type: DataTypes.ENUM("sale", "purchase"), allowNull: false },
})

// OrderItem Model
const OrderItem = sequelize.define("OrderItem", {
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  priceAtOrder: { type: DataTypes.FLOAT, allowNull: false },
})

// Define relationships
Product.hasMany(OrderItem)
OrderItem.belongsTo(Product)

Order.hasMany(OrderItem)
OrderItem.belongsTo(Order)

// Middleware to parse JSON
app.use(express.json())

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, "public")))

// --- Add this route to serve suppliers.html ---

// Serve suppliers.html
app.get("/suppliers", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "suppliers.html"))
})

// Sync models with the database
sequelize.sync().then(() => {
  console.log("Database & tables created!")
})

// Helper function to check stock levels
async function checkStockLevels(productId) {
  const product = await Product.findByPk(productId)
  if (product.stockQuantity <= product.reorderLevel) {
    console.log(`⚠️ Product "${product.name}" needs to be reordered.`)
  }
  if (product.stockQuantity > product.maximumStockLevel) {
    console.log(`⚠️ Product "${product.name}" is overstocked.`)
  }
}

// ----- Products API Routes -----

// Get all products
app.get("/api/products", async (req, res) => {
  const products = await Product.findAll()
  res.json(products)
})

// Get a single product by ID
app.get("/api/products/:id", async (req, res) => {
  const product = await Product.findByPk(req.params.id)
  if (product) {
    res.json(product)
  } else {
    res.status(404).send("Product not found")
  }
})

// Get products with low stock
app.get("/api/products/low-stock", async (req, res) => {
  const products = await Product.findAll({
    where: {
      stockQuantity: { [Op.lte]: Sequelize.col("reorderLevel") },
    },
  })
  res.json(products)
})

// Add a new product
app.post("/api/products", async (req, res) => {
  try {
    const product = await Product.create(req.body)
    await checkStockLevels(product.id)
    res.json(product)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Update a product
app.put("/api/products/:id", async (req, res) => {
  try {
    const [updated] = await Product.update(req.body, {
      where: { id: req.params.id },
    })
    if (updated) {
      const updatedProduct = await Product.findByPk(req.params.id)
      await checkStockLevels(updatedProduct.id)
      res.json(updatedProduct)
    } else {
      res.status(404).send("Product not found")
    }
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Delete a product
app.delete("/api/products/:id", async (req, res) => {
  const deleted = await Product.destroy({
    where: { id: req.params.id },
  })
  if (deleted) {
    res.json({ message: "Product deleted" })
  } else {
    res.status(404).send("Product not found")
  }
})

// ----- Suppliers API Routes -----

// Get all suppliers
app.get("/api/suppliers", async (req, res) => {
  const suppliers = await Supplier.findAll()
  res.json(suppliers)
})

// Get a single supplier by ID
app.get("/api/suppliers/:id", async (req, res) => {
  const supplier = await Supplier.findByPk(req.params.id)
  if (supplier) {
    res.json(supplier)
  } else {
    res.status(404).send("Supplier not found")
  }
})

// Add a new supplier
app.post("/api/suppliers", async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body)
    res.json(supplier)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Update a supplier
app.put("/api/suppliers/:id", async (req, res) => {
  try {
    const [updated] = await Supplier.update(req.body, {
      where: { id: req.params.id },
    })
    if (updated) {
      const updatedSupplier = await Supplier.findByPk(req.params.id)
      res.json(updatedSupplier)
    } else {
      res.status(404).send("Supplier not found")
    }
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Delete a supplier
app.delete("/api/suppliers/:id", async (req, res) => {
  const deleted = await Supplier.destroy({
    where: { id: req.params.id },
  })
  if (deleted) {
    res.json({ message: "Supplier deleted" })
  } else {
    res.status(404).send("Supplier not found")
  }
})

// ----- Orders API Routes (Optional) -----

// Add other routes for orders if required by your project

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
