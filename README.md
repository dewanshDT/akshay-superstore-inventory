# Akshay Superstore Inventory Management System

Welcome to the **Akshay Superstore Inventory Management System**. This application is designed to efficiently track inventory levels, prevent overstocking and stock-outs, and ensure the smooth operation of the Akshay Superstore (COOP). The system utilizes key Database Management Systems (DBMS) concepts and provides a basic front-end interface for users to interact with the inventory data.

---

## Table of Contents

- [Akshay Superstore Inventory Management System](#akshay-superstore-inventory-management-system)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
    - [Development Mode (with automatic restarts):](#development-mode-with-automatic-restarts)
    - [Production Mode:](#production-mode)
  - [Usage](#usage)
    - [Accessing the Application](#accessing-the-application)
    - [Managing Products](#managing-products)
    - [Managing Suppliers](#managing-suppliers)
    - [Stock Level Monitoring](#stock-level-monitoring)
  - [Project Structure](#project-structure)
  - [Database Schema](#database-schema)
    - [Entities and Relationships](#entities-and-relationships)
    - [ER Diagram](#er-diagram)
  - [Contributing](#contributing)
  - [License](#license)
  - [Acknowledgments](#acknowledgments)

---

## Features

- **Product Management**: Add, edit, and delete products in the inventory.
- **Supplier Management**: Manage supplier information including contact details.
- **Stock Level Monitoring**: Automatically monitor stock levels to prevent overstocking and stock-outs.
- **Alerts and Notifications**: Receive alerts when products need to be reordered or are overstocked.
- **Basic Front-End Interface**: Simple and user-friendly interface for interacting with the system.
- **CRUD Operations**: Perform Create, Read, Update, and Delete operations on products and suppliers.
- **Database Integrity**: Utilize DBMS concepts such as normalization, indexing, and transactions to ensure data integrity.

---

## Technologies Used

- **Backend**:

  - [Node.js](https://nodejs.org/) and [Express.js](https://expressjs.com/) for server-side development.
  - [SQLite](https://www.sqlite.org/index.html) as the database engine.
  - [Sequelize](https://sequelize.org/) as the ORM for database interactions.

- **Frontend**:
  - HTML5, CSS3, and JavaScript (ES6) for the user interface.
- **Development Tools**:
  - [Nodemon](https://nodemon.io/) for automatic server restarts during development.
  - [Docker](https://www.docker.com/) (optional) for containerization.

---

## Prerequisites

- **Node.js** (version 12 or higher)
- **npm** (Node Package Manager)
- **Git** (optional, for cloning the repository)

---

## Installation

1. **Clone the Repository** (if using Git):

   ```bash
   git clone https://github.com/dewanshDT/akshay-superstore-inventory.git
   cd akshay-superstore-inventory
   ```

2. **Download the Repository**:

   If not using Git, download the repository as a ZIP file and extract it to your desired location.

3. **Navigate to the Project Directory**:

   ```bash
   cd akshay-superstore-inventory
   ```

4. **Install Dependencies**:

   ```bash
   npm install
   ```

---

## Running the Application

### Development Mode (with automatic restarts):

```bash
npm run dev
```

- The server will start on `http://localhost:3000`.
- The application will automatically restart when you make changes to the code.

### Production Mode:

```bash
npm start
```

---

## Usage

### Accessing the Application

- **Products Page**: [http://localhost:3000/](http://localhost:3000/)
- **Suppliers Page**: [http://localhost:3000/suppliers](http://localhost:3000/suppliers)

### Managing Products

- **Add Product**:

  - Click the **"Add Product"** button.
  - Fill in the product details, including name, description, stock quantity, reorder level, maximum stock level, and price.
  - Click **"Save Product"**.

- **Edit Product**:

  - Click the **"Edit"** button next to the product you want to modify.
  - Update the product details in the form.
  - Click **"Save Product"**.

- **Delete Product**:
  - Click the **"Delete"** button next to the product you want to remove.
  - Confirm the deletion when prompted.

### Managing Suppliers

- **Add Supplier**:

  - Navigate to the **Suppliers** page.
  - Click the **"Add Supplier"** button.
  - Fill in the supplier's name and contact information.
  - Click **"Save Supplier"**.

- **Edit Supplier**:

  - Click the **"Edit"** button next to the supplier you want to modify.
  - Update the supplier details in the form.
  - Click **"Save Supplier"**.

- **Delete Supplier**:
  - Click the **"Delete"** button next to the supplier you want to remove.
  - Confirm the deletion when prompted.

### Stock Level Monitoring

- The system automatically monitors stock levels based on the **stock quantity**, **reorder level**, and **maximum stock level**.
- **Low Stock Alert**:
  - If a product's stock quantity falls below or equals the reorder level, a low stock alert is displayed next to the product name.
  - A message is logged in the server console indicating that the product needs to be reordered.
- **Overstock Alert**:
  - If a product's stock quantity exceeds the maximum stock level, an overstock alert is displayed next to the product name.
  - A message is logged in the server console indicating that the product is overstocked.

---

## Project Structure

```
/your_project_directory
  /public
    index.html           # Products page
    suppliers.html       # Suppliers page
    styles.css           # CSS styling
    app.js               # JavaScript for products
    suppliers.js         # JavaScript for suppliers
  database.sqlite        # SQLite database file
  index.js               # Main server file
  package.json           # Project metadata and scripts
  package-lock.json      # Dependency tree
  Dockerfile             # Docker configuration (optional)
  docker-compose.yml     # Docker Compose configuration (optional)
```

---

## Database Schema

### Entities and Relationships

- **Product**

  - `id`: INTEGER, Primary Key
  - `name`: STRING, Unique, Not Null
  - `description`: TEXT
  - `stockQuantity`: INTEGER, Not Null
  - `reorderLevel`: INTEGER, Not Null
  - `maximumStockLevel`: INTEGER, Not Null
  - `price`: FLOAT, Not Null

- **Supplier**

  - `id`: INTEGER, Primary Key
  - `name`: STRING, Not Null
  - `contactInfo`: STRING

- **Order** (Optional for future extension)

  - `id`: INTEGER, Primary Key
  - `orderDate`: DATE
  - `orderType`: ENUM('sale', 'purchase'), Not Null

- **OrderItem** (Optional for future extension)
  - `id`: INTEGER, Primary Key
  - `quantity`: INTEGER, Not Null
  - `priceAtOrder`: FLOAT, Not Null
  - `ProductId`: FOREIGN KEY references `Product(id)`
  - `OrderId`: FOREIGN KEY references `Order(id)`

### ER Diagram

[Include or attach an ER diagram image here if possible]

---

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**.
2. **Create a new branch** for your feature or bugfix.
3. **Commit your changes** with descriptive messages.
4. **Push to your branch**.
5. **Create a Pull Request** detailing your changes.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgments

- Thanks to all team members and contributors who assisted in developing this application.
- Special appreciation to the instructors and peers who provided guidance and support.
- This project was developed as part of a Database Management Systems course to apply learned concepts in a practical scenario.

---

If you have any questions or need further assistance, please feel free to contact the project maintainers.

Happy inventory managing!
