const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
};

write('src/pages/admin/AdminProducts.jsx', `import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    api.get('/products').then(res => {
      setProducts(res.data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchProducts(); }, []);

  const deleteProduct = async (id) => {
    if(window.confirm('Delete this product?')) {
      try {
        await api.delete(\`/products/\${id}\`);
        toast.success('Product deleted');
        fetchProducts();
      } catch(err) { toast.error('Error deleting product'); }
    }
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Products</h2>
        <button onClick={() => alert('Add Product UI coming in next update')} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          + Add Product
        </button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-4 font-semibold text-gray-600">Image</th>
              <th className="p-4 font-semibold text-gray-600">Name</th>
              <th className="p-4 font-semibold text-gray-600">Price</th>
              <th className="p-4 font-semibold text-gray-600">Gender</th>
              <th className="p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  <img src={p.images?.[0] || 'https://via.placeholder.com/50'} alt="product" className="w-12 h-12 object-cover rounded" />
                </td>
                <td className="p-4">{p.name}</td>
                <td className="p-4">\$\{p.price.toFixed(2)}</td>
                <td className="p-4">{p.gender}</td>
                <td className="p-4">
                  <button className="text-blue-500 hover:underline mr-4">Edit</button>
                  <button onClick={() => deleteProduct(p._id)} className="text-red-500 hover:underline">Delete</button>
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
    // We need an admin route for GET ALL orders. The backend should have it.
    api.get('/orders').then(res => {
      setOrders(res.data);
      setLoading(false);
    }).catch(err => {
      console.log(err);
      setLoading(false);
    });
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(\`/orders/\${id}/status\`, { status });
      toast.success('Status updated');
      fetchOrders();
    } catch(err) { toast.error('Error updating status'); }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Orders</h2>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-4 font-semibold">Order ID</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Total</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-sm">{order._id}</td>
                <td className="p-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-sm">\$\{order.total.toFixed(2)}</td>
                <td className="p-4">
                  <span className={\`px-2 py-1 rounded text-xs font-semibold \${order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}\`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td className="p-4">
                  <select 
                    value={order.orderStatus} 
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="border p-1 rounded text-sm"
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

write('src/pages/admin/Dashboard.jsx', `import { Link, Routes, Route } from 'react-router-dom';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <div className="bg-white border rounded-lg p-4">
          <h2 className="font-bold text-xl mb-6">Admin Panel</h2>
          <ul className="space-y-4">
            <li><Link to="/admin" className="text-gray-600 hover:text-black font-medium">Dashboard Overview</Link></li>
            <li><Link to="/admin/products" className="text-gray-600 hover:text-black font-medium">Manage Products</Link></li>
            <li><Link to="/admin/orders" className="text-gray-600 hover:text-black font-medium">Manage Orders</Link></li>
          </ul>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={
            <div>
              <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <h3 className="text-gray-500 font-medium">Total Revenue</h3>
                  <p className="text-3xl font-bold mt-2">$0.00</p>
                </div>
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <h3 className="text-gray-500 font-medium">Total Orders</h3>
                  <p className="text-3xl font-bold mt-2">0</p>
                </div>
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <h3 className="text-gray-500 font-medium">Total Products</h3>
                  <p className="text-3xl font-bold mt-2">15</p>
                </div>
              </div>
            </div>
          } />
          <Route path="/products" element={<AdminProducts />} />
          <Route path="/orders" element={<AdminOrders />} />
        </Routes>
      </div>
    </div>
  );
}
`);
