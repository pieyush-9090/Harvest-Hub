# 🌾 HarvestHub - Agricultural E-commerce Website

**HarvestHub** is a modern and classy e-commerce platform designed to connect farmers with consumers by offering fresh, organic agricultural products. The platform features product browsing, dynamic cart management, secure checkout, user profile dashboards, and order confirmation with GST calculation.

## 🌟 Core Features

- **Home Page**  
  Nature-inspired design with featured products, testimonials, and newsletter subscription.

- **Shop Page**  
  Browse products with filters (category, price range) and sorting options.

- **Cart Page**  
  Dynamic cart with quantity updates and promo code application.

- **Checkout Page**  
  - Shipping address input  
  - Delivery method selection  
  - Multiple payment options: **Credit Card, UPI, Net Banking, COD**  
  - Order summary and GST (18%) calculation

- **Confirmation Page**  
  Displays order details with a **random Order ID**, **payment method**, and **total (with GST)**. Includes **Print Receipt** functionality.

- **User Profile**  
  Dashboard for managing orders, subscriptions, addresses, and payment methods.

## 🛠️ Additional Features

- ✅ Responsive design for all devices  
- ✅ Dynamic item summary during checkout  
- ✅ GST calculation (18%)  
- ✅ Secure checkout  
- ✅ Receipt printing (confirmation page)  
- ✅ User authentication (Signup/Login)

## 🧰 Technologies Used

### 🔸 Frontend

- **HTML5** – Structure  
- **CSS3** – Styling & responsive design  
- **JavaScript (ES6)** – Interactivity and localStorage  
- **Font Awesome** – Icons  
- **Google Fonts** – Playfair Display & Poppins  
- **Print Styles** – Custom CSS for clean receipt printing

### 🔹 Backend

- **Flask** – Python web framework  
- **MongoDB Atlas** – Cloud database  
- **Flask-Bcrypt** – Password hashing  
- **Flask-CORS** – Cross-origin support  
- **python-dotenv** – Environment variable management

## 🚀 How to Run HarvestHub Locally

### 1. 📥 Download the Project

- Visit the GitHub repository  
- Click the green **Code** button > **Download ZIP**  
- Extract the ZIP file to your desired location

### 2. 💻 Open in VS Code

- Launch **Visual Studio Code**  
- Go to **File > Open Folder**  
- Select the extracted `harvesthub` folder

### 3. 🧱 Install Dependencies

Open the terminal in VS Code and run:

```
pip install flask flask-bcrypt flask-cors pymongo python-dotenv
```

### 4. ▶️ Run the App

```
python app.py
```

Visit `http://127.0.0.1:5000/` in your browser. You're now running HarvestHub locally!

## 📦 File Structure

```
harvesthub/
├── index.html            # Home Page
├── shop.html             # Product Browsing
├── cart.html             # Shopping Cart
├── checkout.html         # Checkout Page
├── confirmation.html     # Order Confirmation
├── profile.html          # User Dashboard
├── styles.css            # Global Styles
├── shop.css              # Shop Styles
├── cart.css              # Cart Styles
├── checkout.css          # Checkout Styles
├── confirmation.css      # Confirmation Styles
├── script.js             # Global JS
├── cart.js               # Cart JS
├── checkout.js           # Checkout JS
├── confirmation.js       # Confirmation JS
├── app.py                # Flask Backend
├── .env                  # Environment Variables
└── README.md             # Documentation
```

## 🧾 Print Receipt

On the **confirmation page**, click **"Print Receipt"** to generate a clean, printable copy of your order details.

## 📄 License

This project is licensed under the **MIT License**.  
See the `LICENSE` file for more details.

## 📬 Contact

**Piyush Priyadarsi Panda**  
📧 Email: [piyush.panda9090@gmail.com](piyush.panda9090@gmail.com)  
💻 GitHub: [pieyush-9090](https://github.com/pieyush-9090)

> Thank you for supporting **HarvestHub** – empowering agriculture through technology! 🌱
