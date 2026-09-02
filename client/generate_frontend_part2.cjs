const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
};

write('src/main.jsx', `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster position="bottom-right" />
  </React.StrictMode>,
)
`);

write('src/App.jsx', `import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';
import useCartStore from './store/cartStore';

// Layouts & Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Dashboard from './pages/admin/Dashboard';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuthStore();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
  return children;
};

function App() {
  const { checkAuth, user } = useAuthStore();
  const { fetchCart } = useCartStore();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/cart" element={
              <ProtectedRoute><Cart /></ProtectedRoute>
            } />
            
            <Route path="/admin/*" element={
              <ProtectedRoute adminOnly={true}>
                <Dashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
`);

write('src/components/Navbar.jsx', `import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, User, Search, Menu, LogOut } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { cart } = useCartStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <button className="sm:hidden p-2"><Menu className="w-6 h-6" /></button>
            <Link to="/" className="text-2xl font-bold tracking-tighter text-gray-900 ml-2 sm:ml-0">
              Blissbix.
            </Link>
          </div>
          
          <div className="hidden sm:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-black">Home</Link>
            <Link to="/shop" className="text-gray-600 hover:text-black">Shop</Link>
            <Link to="/shop?gender=Men" className="text-gray-600 hover:text-black">Men</Link>
            <Link to="/shop?gender=Women" className="text-gray-600 hover:text-black">Women</Link>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-black"><Search className="w-5 h-5" /></button>
            <Link to="/wishlist" className="text-gray-600 hover:text-black"><Heart className="w-5 h-5" /></Link>
            <Link to="/cart" className="text-gray-600 hover:text-black relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="group relative">
                <button className="text-gray-600 hover:text-black flex items-center">
                  <User className="w-5 h-5" />
                </button>
                <div className="absolute right-0 w-48 bg-white border mt-2 py-2 rounded shadow-lg hidden group-hover:block">
                  <div className="px-4 py-2 border-b text-sm font-semibold">{user.name}</div>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-2 text-sm hover:bg-gray-100">Dashboard</Link>
                  )}
                  <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">Profile</Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-gray-100">My Orders</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600 flex items-center">
                    <LogOut className="w-4 h-4 mr-2"/> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-black border px-3 py-1 rounded">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
`);

write('src/components/Footer.jsx', `export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-2xl font-bold mb-4">Blissbix.</h3>
          <p className="text-gray-400 text-sm">Your ultimate fashion destination. Premium quality, modern designs.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Men</li>
            <li>Women</li>
            <li>Kids</li>
            <li>New Arrivals</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Contact Us</li>
            <li>FAQs</li>
            <li>Shipping & Returns</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Newsletter</h4>
          <div className="flex">
            <input type="email" placeholder="Your email" className="px-4 py-2 w-full text-black rounded-l" />
            <button className="bg-white text-black px-4 py-2 font-semibold rounded-r">Subscribe</button>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-500 text-sm mt-8 border-t border-gray-800 pt-8">
        © {new Date().getFullYear()} Blissbix Fashion Store. All rights reserved.
      </div>
    </footer>
  );
}
`);

console.log('Frontend Part 2 generated');
