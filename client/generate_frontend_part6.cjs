const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
};

write('src/pages/Profile.jsx', `import useAuthStore from '../store/authStore';

export default function Profile() {
  const { user } = useAuthStore();
  
  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <div className="bg-white shadow rounded-lg p-6 border">
        <div className="space-y-4">
          <div>
            <label className="text-gray-500 text-sm">Full Name</label>
            <p className="font-semibold text-lg">{user.name}</p>
          </div>
          <div>
            <label className="text-gray-500 text-sm">Email Address</label>
            <p className="font-semibold text-lg">{user.email}</p>
          </div>
          <div>
            <label className="text-gray-500 text-sm">Role</label>
            <p className="font-semibold text-lg capitalize">{user.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
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
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Dashboard from './pages/admin/Dashboard';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuthStore();
  if (loading) return <div className="p-8 text-center">Loading...</div>;
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
            
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            
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

console.log('App routes and Profile generated!');
