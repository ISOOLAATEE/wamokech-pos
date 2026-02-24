# ☕ Wamokech - Coffee Shop POS System

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=flat&logo=javascript&logoColor=%23F7DF1E)

## 📖 Overview
Wamokech is a comprehensive, web-based Point of Sale (POS) application built specifically for complete coffee shop management. **It was developed as an end-of-studies project for a IT Technician diploma.** Built entirely with HTML, CSS, and  JavaScript, it functions independently in the browser without a backend by utilizing the Web Storage API.

## 🔑 Demo Access
To test the application, authentication is required. Use the hardcoded credentials:
* **Username:** `chakir`
* **Password:** `123`

## ✨ Key Features
* **Dynamic Dashboard:** Real-time tracking of daily sales (in MAD), average order value, and most popular menu items.
* **Checkout & Payments:** Handles cash payments (with automated change calculation) and card transactions. Supports custom discounts (% or fixed amount) and tracks dine-in (table selection) versus takeaway orders.
* **Receipts & Invoicing:** Automatically generates dynamic receipts with options to print (`window.print()`) or download as a `.txt` file. Includes a CSV export feature for the complete billing history using JavaScript `Blob` objects.
* **Inventory Management:** Tracks stock levels for raw ingredients (e.g., Coffee beans, Milk, Cups) and triggers automated low-stock warnings based on custom thresholds.
* **Customer Database (CRM):** Registers loyal customers and automatically tracks their lifetime order history and total amount spent.
* **Menu CRUD Operations:** Admin interface to safely add, edit, or remove menu items, supporting base64 image encoding via `FileReader`.

## 💻 Tech Stack
* **Frontend:** HTML5, CSS3, and FontAwesome icons for a modern, responsive user interface.
* **Business Logic:** Vanilla JavaScript handling cart state, tax/discount math, filtering, and dynamic DOM updates.
* **Data Persistence:** Utilizes `localStorage` to securely save order history, inventory, customer data, and custom menu items across browser sessions.

## 🚀 Getting Started
Because this application runs entirely client-side, no server setup is required.
1. Clone this repository to your local machine.
2. Open the `index.html` file directly in any modern web browser.
