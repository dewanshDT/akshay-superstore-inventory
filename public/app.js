// public/app.js

document.addEventListener("DOMContentLoaded", () => {
  fetchProducts()

  const productForm = document.getElementById("product-form")
  if (productForm) {
    productForm.addEventListener("submit", saveProduct)
  }
})

let productsData = [] // Store the products data

function fetchProducts() {
  fetch("/api/products")
    .then((response) => response.json())
    .then((products) => {
      productsData = products // Store the data for CSV export
      const tbody = document.querySelector("#products-table tbody")
      tbody.innerHTML = ""
      products.forEach((product) => {
        const row = document.createElement("tr")

        // Calculate the percentage of current stock to maximum stock
        const stockPercentage =
          (product.stockQuantity / product.maximumStockLevel) * 100

        let alertMessage = ""
        if (product.stockQuantity <= product.reorderLevel) {
          alertMessage = " ⚠️ Low Stock"
        } else if (product.stockQuantity > product.maximumStockLevel) {
          alertMessage = " ⚠️ Overstocked"
        }

        // New warning for stock <= 10% of maximum stock
        if (stockPercentage <= 10) {
          alertMessage += " ⚠️ Critical Stock Level"
          // Add a class to highlight the row
          row.classList.add("critical-stock")
        }

        row.innerHTML = `
          <td>${product.name}${alertMessage}</td>
          <td>${product.description || ""}</td>
          <td>${product.stockQuantity}</td>
          <td>${product.reorderLevel}</td>
          <td>${product.maximumStockLevel}</td>
          <td>${product.price}</td>
          <td class="actions">
            <button onclick="editProduct(${product.id})">Edit</button>
            <button onclick="deleteProduct(${product.id})">Delete</button>
          </td>
        `
        tbody.appendChild(row)
      })
    })
    .catch((error) => console.error("Error fetching products:", error))
}

function exportProductsToCSV() {
  if (productsData.length === 0) {
    alert("No data available to export.")
    return
  }

  const csvRows = []
  // Define the headers
  const headers = [
    "ID",
    "Name",
    "Description",
    "Stock Quantity",
    "Reorder Level",
    "Maximum Stock Level",
    "Price",
  ]
  csvRows.push(headers.join(","))

  // Add the data
  for (const product of productsData) {
    const values = [
      product.id,
      `"${product.name}"`,
      `"${product.description || ""}"`,
      product.stockQuantity,
      product.reorderLevel,
      product.maximumStockLevel,
      product.price,
    ]
    csvRows.push(values.join(","))
  }

  // Create a Blob from the CSV string
  const csvString = csvRows.join("\n")
  const blob = new Blob([csvString], { type: "text/csv" })

  // Create a link to download it
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "products.csv"
  a.click()
  window.URL.revokeObjectURL(url)
}

function showAddProductForm() {
  document.getElementById("form-title").textContent = "Add Product"
  document.getElementById("product-form").reset()
  document.querySelector('#product-form input[name="id"]').value = ""
  document.getElementById("product-form-container").style.display = "block"
}

function hideProductForm() {
  document.getElementById("product-form-container").style.display = "none"
}

function saveProduct(event) {
  event.preventDefault()

  const formData = new FormData(event.target)
  const productData = {}
  formData.forEach((value, key) => {
    if (key === "id" && value === "") return
    productData[key] = [
      "price",
      "stockQuantity",
      "reorderLevel",
      "maximumStockLevel",
    ].includes(key)
      ? parseFloat(value)
      : value
  })

  const productId = formData.get("id")
  const method = productId ? "PUT" : "POST"
  const url = productId ? `/api/products/${productId}` : "/api/products"

  fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  })
    .then((response) => response.json())
    .then((product) => {
      fetchProducts()
      hideProductForm()
    })
    .catch((error) => console.error("Error saving product:", error))
}

function editProduct(id) {
  fetch(`/api/products/${id}`)
    .then((response) => response.json())
    .then((product) => {
      document.getElementById("form-title").textContent = "Edit Product"
      document.querySelector('#product-form input[name="id"]').value =
        product.id
      document.querySelector('#product-form input[name="name"]').value =
        product.name
      document.querySelector(
        '#product-form textarea[name="description"]'
      ).value = product.description
      document.querySelector(
        '#product-form input[name="stockQuantity"]'
      ).value = product.stockQuantity
      document.querySelector('#product-form input[name="reorderLevel"]').value =
        product.reorderLevel
      document.querySelector(
        '#product-form input[name="maximumStockLevel"]'
      ).value = product.maximumStockLevel
      document.querySelector('#product-form input[name="price"]').value =
        product.price
      document.getElementById("product-form-container").style.display = "block"
    })
    .catch((error) => console.error("Error fetching product:", error))
}

function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    fetch(`/api/products/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          fetchProducts()
        } else {
          console.error("Error deleting product")
        }
      })
      .catch((error) => console.error("Error deleting product:", error))
  }
}
