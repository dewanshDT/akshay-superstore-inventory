// public/suppliers.js

document.addEventListener("DOMContentLoaded", () => {
  fetchSuppliers()

  const supplierForm = document.getElementById("supplier-form")
  if (supplierForm) {
    supplierForm.addEventListener("submit", saveSupplier)
  }
})

let suppliersData = [] // Store the suppliers data

function fetchSuppliers() {
  fetch("/api/suppliers")
    .then((response) => response.json())
    .then((suppliers) => {
      suppliersData = suppliers // Store the data for CSV export
      const tbody = document.querySelector("#suppliers-table tbody")
      tbody.innerHTML = ""
      suppliers.forEach((supplier) => {
        const row = document.createElement("tr")
        row.innerHTML = `
          <td>${supplier.name}</td>
          <td>${supplier.contactInfo || ""}</td>
          <td class="actions">
            <button onclick="editSupplier(${supplier.id})">Edit</button>
            <button onclick="deleteSupplier(${supplier.id})">Delete</button>
          </td>
        `
        tbody.appendChild(row)
      })
    })
    .catch((error) => console.error("Error fetching suppliers:", error))
}

function exportSuppliersToCSV() {
  if (suppliersData.length === 0) {
    alert("No data available to export.")
    return
  }

  const csvRows = []
  // Define the headers
  const headers = ["ID", "Name", "Contact Info"]
  csvRows.push(headers.join(","))

  // Add the data
  for (const supplier of suppliersData) {
    const values = [
      supplier.id,
      `"${supplier.name}"`,
      `"${supplier.contactInfo || ""}"`,
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
  a.download = "suppliers.csv"
  a.click()
  window.URL.revokeObjectURL(url)
}

function showAddSupplierForm() {
  document.getElementById("form-title").textContent = "Add Supplier"
  document.getElementById("supplier-form").reset()
  document.querySelector('#supplier-form input[name="id"]').value = ""
  document.getElementById("supplier-form-container").style.display = "block"
}

function hideSupplierForm() {
  document.getElementById("supplier-form-container").style.display = "none"
}

function saveSupplier(event) {
  event.preventDefault()

  const formData = new FormData(event.target)
  const supplierData = {}
  formData.forEach((value, key) => {
    if (key === "id" && value === "") return
    supplierData[key] = value
  })

  const supplierId = formData.get("id")
  const method = supplierId ? "PUT" : "POST"
  const url = supplierId ? `/api/suppliers/${supplierId}` : "/api/suppliers"

  fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(supplierData),
  })
    .then((response) => response.json())
    .then((supplier) => {
      fetchSuppliers()
      hideSupplierForm()
    })
    .catch((error) => console.error("Error saving supplier:", error))
}

function editSupplier(id) {
  fetch(`/api/suppliers/${id}`)
    .then((response) => response.json())
    .then((supplier) => {
      document.getElementById("form-title").textContent = "Edit Supplier"
      document.querySelector('#supplier-form input[name="id"]').value =
        supplier.id
      document.querySelector('#supplier-form input[name="name"]').value =
        supplier.name
      document.querySelector('#supplier-form input[name="contactInfo"]').value =
        supplier.contactInfo
      document.getElementById("supplier-form-container").style.display = "block"
    })
    .catch((error) => console.error("Error fetching supplier:", error))
}

function deleteSupplier(id) {
  if (confirm("Are you sure you want to delete this supplier?")) {
    fetch(`/api/suppliers/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          fetchSuppliers()
        } else {
          console.error("Error deleting supplier")
        }
      })
      .catch((error) => console.error("Error deleting supplier:", error))
  }
}
