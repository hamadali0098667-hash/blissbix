const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
};

write('src/pages/Home.jsx', `import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="Fashion" className="w-full h-full object-cover opacity-50" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Discover Your Style</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">Explore the latest trends in fashion and upgrade your wardrobe with our premium collections.</p>
          <Link to="/shop" className="bg-white text-black px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 transition">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {['Men', 'Women', 'Accessories'].map((cat) => (
            <div key={cat} className="relative h-96 group overflow-hidden bg-gray-100 rounded">
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <Link to={\`/shop?category=\${cat}\`} className="bg-white px-6 py-2 font-semibold text-black uppercase tracking-wider group-hover:bg-black group-hover:text-white transition">
                  {cat}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
`);

write('src/pages/Login.jsx', `import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Logged in successfully');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white border rounded shadow-sm">
      <h2 className="text-2xl font-bold text-center mb-6">Login to Blissbix</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 w-full p-2 border rounded" />
        </div>
        <button disabled={loading} type="submit" className="w-full bg-black text-white p-2 rounded hover:bg-gray-800 disabled:opacity-50">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
      </p>
    </div>
  );
}
`);

write('src/pages/Register.jsx', `import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const { register, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData.name, formData.email, formData.password, formData.phone);
      toast.success('Registered successfully');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white border rounded shadow-sm">
      <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input type="text" name="name" required onChange={handleChange} className="mt-1 w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" name="email" required onChange={handleChange} className="mt-1 w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input type="tel" name="phone" onChange={handleChange} className="mt-1 w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" name="password" required onChange={handleChange} className="mt-1 w-full p-2 border rounded" />
        </div>
        <button disabled={loading} type="submit" className="w-full bg-black text-white p-2 rounded hover:bg-gray-800 disabled:opacity-50">
          {loading ? 'Creating...' : 'Register'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
      </p>
    </div>
  );
}
`);

write('src/pages/Shop.jsx', `import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useProductStore from '../store/productStore';

export default function Shop() {
  const { products, fetchProducts, loading } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading products...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shop All</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 flex-shrink-0">
          {/* Filters placeholder */}
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-4">Filters</h3>
            <p className="text-sm text-gray-500">Filters coming soon...</p>
          </div>
        </div>

        <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product._id} className="group relative">
              <div className="aspect-w-3 aspect-h-4 bg-gray-200 rounded-lg overflow-hidden relative">
                {product.images?.length > 0 ? (
                  <img src={product.images[0]} alt={product.name} className="object-cover w-full h-80 group-hover:opacity-75" />
                ) : (
                  <div className="w-full h-80 bg-gray-200 flex items-center justify-center text-gray-500">No Image</div>
                )}
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <Link to={\`/product/\${product._id}\`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.gender} • {product.category?.name}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">\$\{(product.salePrice || product.price).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
`);

write('src/pages/ProductDetails.jsx', `import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import useCartStore from '../store/cartStore';
import toast from 'react-hot-toast';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart, loading } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(\`/products/\${id}\`);
        setProduct(data);
      } catch (err) {}
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div className="p-8 text-center">Loading...</div>;

  const uniqueSizes = [...new Set(product.variants?.map(v => v.size))];
  const uniqueColors = [...new Set(product.variants?.map(v => v.color))];
  
  const currentVariant = product.variants?.find(v => v.size === selectedSize && v.color === selectedColor);
  const maxStock = currentVariant ? currentVariant.stock : 0;

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      toast.error('Please select size and color');
      return;
    }
    if (quantity > maxStock) {
      toast.error('Not enough stock available');
      return;
    }
    try {
      await addToCart(product._id, selectedSize, selectedColor, quantity, product.salePrice || product.price);
      toast.success('Added to cart!');
    } catch (err) {
      if(err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-w-3 aspect-h-4 bg-gray-100 rounded-lg overflow-hidden">
          {product.images?.length > 0 ? (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
             <div className="w-full h-[500px] flex items-center justify-center bg-gray-200">No Image</div>
          )}
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-2xl mt-4 font-semibold">\$\{(product.salePrice || product.price).toFixed(2)}</p>
          <div className="mt-6 prose prose-sm text-gray-500">
            <p>{product.description}</p>
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-900">Color</h3>
            <div className="mt-2 flex items-center space-x-3">
              {uniqueColors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={\`w-8 h-8 rounded-full border-2 \${selectedColor === color ? 'border-black' : 'border-transparent shadow-sm'}\`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-900">Size</h3>
            <div className="mt-2 grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
              {uniqueSizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={\`group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none \${selectedSize === size ? 'ring-2 ring-black bg-black text-white hover:bg-black' : 'bg-white text-gray-900'}\`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-6">
             <p className="text-sm text-gray-600 mb-2">
               Availability: {selectedSize && selectedColor ? (maxStock > 0 ? \`\${maxStock} in stock\` : 'Out of stock') : 'Select options to see stock'}
             </p>
             <div className="flex items-center border rounded w-32 justify-between">
                <button onClick={()=>setQuantity(Math.max(1, quantity-1))} className="p-2 w-10 border-r hover:bg-gray-100">-</button>
                <span className="p-2">{quantity}</span>
                <button onClick={()=>setQuantity(quantity+1)} disabled={quantity >= maxStock} className="p-2 w-10 border-l hover:bg-gray-100 disabled:opacity-50">+</button>
             </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={loading || !currentVariant || maxStock === 0}
            className="mt-8 w-full bg-black border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-gray-900 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding...' : 'Add to bag'}
          </button>
        </div>
      </div>
    </div>
  );
}
`);

console.log('Frontend Part 3 generated');
