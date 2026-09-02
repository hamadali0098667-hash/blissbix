# Blissbix Fashion Store

Blissbix is a fully functional, premium fashion e-commerce web application built using the MERN stack (MongoDB, Express.js, React, Node.js). 

![Blissbix Demo](https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=1200)

## 🚀 Features

### Customer Features
- **Modern Premium UI:** Built with Tailwind CSS, featuring glass-morphism, smooth animations, and a fully mobile-responsive design.
- **Product Catalog:** Browse products by categories (Men, Women, Accessories, Kids) with dynamic filtering and search.
- **Advanced Product Details:** Select size and color variants. Real-time stock validation (Out of stock disabling).
- **Shopping Cart & Wishlist:** Add items to cart or save them for later in the wishlist.
- **Checkout & Orders:** Place cash-on-delivery orders and track order status (Pending, Processing, Shipped, Delivered) in the "My Orders" dashboard.
- **User Authentication:** Secure JWT-based registration and login. Profile management.

### Admin Features
- **Admin Dashboard:** Access a protected admin panel to manage the entire store.
- **Manage Products:** Add new products with image URLs, set prices, and delete old products.
- **Manage Orders:** View all customer orders and update their shipping status dynamically.
- **Manage Users:** View all registered customers and delete accounts if necessary.

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS, Zustand (State Management), React Router DOM, Lucide React (Icons), React Hot Toast.
- **Backend:** Node.js, Express.js, JWT (JSON Web Tokens), bcryptjs.
- **Database:** MongoDB (Mongoose ODM), MongoDB Atlas.

## 💻 Getting Started (Local Development)

### Prerequisites
- Node.js installed
- MongoDB installed locally or a MongoDB Atlas URI

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/blissbix.git
cd blissbix
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal and navigate to the client folder:
```bash
cd client
npm install
```
Start the Vite development server:
```bash
npm run dev
```
The frontend will run on `http://localhost:5173`.

## 📦 Deployment Guide (Vercel & Render)

### Deploying the Backend (Render / Railway)
1. Push your code to GitHub.
2. Go to [Render](https://render.com/) and create a new **Web Service**.
3. Connect your GitHub repo and select the `server` folder as the root directory.
4. Set the build command to `npm install` and start command to `node server.js`.
5. Add your `.env` variables (MONGO_URI, JWT_SECRET) in Render's environment settings.
6. Deploy! Copy the live backend URL.

### Deploying the Frontend (Vercel)
1. Go to `client/src/services/api.js` and change the `baseURL` to your live Render backend URL.
2. Commit and push the changes to GitHub.
3. Go to [Vercel](https://vercel.com/) and import your GitHub repository.
4. Set the Root Directory to `client`.
5. Vercel will automatically detect Vite. Click **Deploy**.
6. Your Blissbix store is now live!

---
*Built with ❤️ during the 6-Week MERN Stack Internship.*
