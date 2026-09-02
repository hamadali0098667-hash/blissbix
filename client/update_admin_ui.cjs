const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
};

write('src/pages/admin/Dashboard.jsx', `import { Link, Routes, Route, useLocation } from 'react-router-dom';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';
import AdminCategories from './AdminCategories';

export default function Dashboard() {
  const location = useLocation();
  
  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') return 'bg-gray-800 text-white border-l-4 border-indigo-500';
    if (path !== '/admin' && location.pathname.includes(path)) return 'bg-gray-800 text-white border-l-4 border-indigo-500';
    return 'text-gray-400 hover:bg-gray-800 hover:text-white border-l-4 border-transparent transition-colors';
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Sidebar - Modern Dark Theme */}
      <div className="w-64 bg-gray-900 text-white shadow-xl flex-shrink-0">
        <div className="p-6">
          <h2 className="text-2xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 uppercase">
            Admin Panel
          </h2>
          <p className="text-xs text-gray-500 mt-1">Blissbix Management</p>
        </div>
        <ul className="mt-4 flex flex-col gap-1">
          <li>
            <Link to="/admin" className={\`flex items-center px-6 py-3 font-medium \${isActive('/admin')}\`}>
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/products" className={\`flex items-center px-6 py-3 font-medium \${isActive('/products')}\`}>
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
              Products
            </Link>
          </li>
          <li>
            <Link to="/admin/orders" className={\`flex items-center px-6 py-3 font-medium \${isActive('/orders')}\`}>
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              Orders
            </Link>
          </li>
          <li>
            <Link to="/admin/categories" className={\`flex items-center px-6 py-3 font-medium \${isActive('/categories')}\`}>
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
              Categories
            </Link>
          </li>
          <li>
            <Link to="/admin/users" className={\`flex items-center px-6 py-3 font-medium \${isActive('/users')}\`}>
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              Users
            </Link>
          </li>
        </ul>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <Routes>
          <Route path="/" element={
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Stat Card 1 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Revenue</h3>
                    <p className="text-4xl font-extrabold text-gray-800 mt-2">$0.00</p>
                  </div>
                  <div className="bg-green-100 p-4 rounded-full text-green-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                </div>
                {/* Stat Card 2 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Orders</h3>
                    <p className="text-4xl font-extrabold text-gray-800 mt-2">0</p>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                  </div>
                </div>
                {/* Stat Card 3 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Products</h3>
                    <p className="text-4xl font-extrabold text-gray-800 mt-2">15</p>
                  </div>
                  <div className="bg-purple-100 p-4 rounded-full text-purple-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                  </div>
                </div>
              </div>
            </div>
          } />
          <Route path="/products" element={<AdminProducts />} />
          <Route path="/orders" element={<AdminOrders />} />
          <Route path="/categories" element={<AdminCategories />} />
          <Route path="/users" element={<AdminUsers />} />
        </Routes>
      </div>
    </div>
  );
}
`);

write('src/pages/admin/AdminProducts.jsx', `import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', gender: 'Men' });

  const fetchProducts = () => {
    api.get('/products').then(res => {
      setProducts(res.data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchProducts(); }, []);

  const deleteProduct = async (id) => {
    if(window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(\`/products/\${id}\`);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch(err) { toast.error('Error deleting product'); }
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProduct,
        price: Number(newProduct.price),
        variants: [{ size: 'M', color: 'Default', stock: 100 }],
        images: ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80']
      };
      await api.post('/products', payload);
      toast.success('Product added successfully!');
      setShowAdd(false);
      fetchProducts();
    } catch(err) {
      toast.error('Failed to add product');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Products Inventory</h2>
          <p className="text-gray-500 mt-1">Manage your store catalog</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg shadow hover:bg-indigo-700 transition flex items-center font-medium">
          {showAdd ? 'Cancel' : <><svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg> Add Product</>}
        </button>
      </div>
      
      {showAdd && (
        <form onSubmit={addProduct} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 transition-all">
          <h3 className="font-bold text-xl mb-6 text-gray-800 border-b pb-4">Create New Product</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
               <input required value={newProduct.name} onChange={e=>setNewProduct({...newProduct, name: e.target.value})} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2.5 border" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
               <input required type="number" step="0.01" value={newProduct.price} onChange={e=>setNewProduct({...newProduct, price: e.target.value})} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2.5 border" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Category / Gender</label>
               <select value={newProduct.gender} onChange={e=>setNewProduct({...newProduct, gender: e.target.value})} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2.5 border bg-white">
                 <option value="Men">Men</option>
                 <option value="Women">Women</option>
                 <option value="Accessories">Accessories</option>
               </select>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea required rows="3" value={newProduct.description} onChange={e=>setNewProduct({...newProduct, description: e.target.value})} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2.5 border" />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-indigo-600 text-white px-8 py-2.5 rounded-lg shadow hover:bg-indigo-700 transition font-medium">Save Product</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(p => (
              <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      <img className="h-12 w-12 rounded-lg object-cover border" src={p.images?.[0] || 'https://via.placeholder.com/50'} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{p.name}</div>
                      <div className="text-sm text-gray-500">{p._id.substring(0,8)}...</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">\$\{p.price?.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                    {p.gender}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => deleteProduct(p._id)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
`);

write('src/pages/admin/AdminOrders.jsx', `import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    api.get('/orders').then(res => {
      setOrders(res.data);
      setLoading(false);
    }).catch(err => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(\`/orders/\${id}/status\`, { status });
      toast.success('Order status updated');
      fetchOrders();
    } catch(err) { toast.error('Error updating status'); }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Order Management</h2>
        <p className="text-gray-500 mt-1">Track and update customer orders</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Amount</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Status</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Update Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map(order => (
              <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{order._id.substring(order._id.length - 8).toUpperCase()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  \$\{order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={\`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border \${getStatusColor(order.orderStatus)}\`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <select 
                    value={order.orderStatus} 
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg border bg-white shadow-sm"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
`);

write('src/pages/admin/AdminCategories.jsx', `import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  
  const fetchCategories = () => {
    api.get('/categories').then(res => setCategories(res.data)).catch(console.error);
  };
  
  useEffect(() => { fetchCategories(); }, []);

  const addCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', { name, description: name });
      setName('');
      toast.success('Category added');
      fetchCategories();
    } catch(err) { toast.error('Failed to add category'); }
  };

  const deleteCategory = async (id) => {
    if(window.confirm('Delete category?')) {
      try {
        await api.delete(\`/categories/\${id}\`);
        toast.success('Category deleted');
        fetchCategories();
      } catch(err) { toast.error('Failed to delete'); }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Categories</h2>
        <p className="text-gray-500 mt-1">Organize your store catalog</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <form onSubmit={addCategory} className="flex gap-4">
          <input required value={name} onChange={e => setName(e.target.value)} placeholder="E.g., Winter Collection" className="border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 p-3 rounded-lg flex-1 shadow-sm" />
          <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-lg shadow hover:bg-indigo-700 transition font-medium flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Add Category
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category Name</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map(c => (
              <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center">
                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 mr-4">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                    </div>
                    {c.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => deleteCategory(c._id)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
`);

write('src/pages/admin/AdminUsers.jsx', `import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    api.get('/auth/users').then(res => setUsers(res.data)).catch(console.error);
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Customers & Users</h2>
        <p className="text-gray-500 mt-1">View registered accounts</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User details</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(u => (
              <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-lg">
                      {u.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{u.name}</div>
                      <div className="text-sm text-gray-500">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={\`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full \${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}\`}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
`);
