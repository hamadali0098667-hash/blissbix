const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
};

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
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Categories</h2>
      <form onSubmit={addCategory} className="mb-8 flex gap-4">
        <input required value={name} onChange={e => setName(e.target.value)} placeholder="New Category Name" className="border p-2 rounded flex-1" />
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">Add Category</button>
      </form>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c._id} className="border-b">
                <td className="p-4">{c.name}</td>
                <td className="p-4">
                  <button onClick={() => deleteCategory(c._id)} className="text-red-500 hover:underline">Delete</button>
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
    // Admin route for users. Ensure backend has GET /api/auth/users
    api.get('/auth/users').then(res => setUsers(res.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Users</h2>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-b">
                <td className="p-4">{u.name}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4 capitalize">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
    if(window.confirm('Delete this product?')) {
      try {
        await api.delete(\`/products/\${id}\`);
        toast.success('Product deleted');
        fetchProducts();
      } catch(err) { toast.error('Error deleting product'); }
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      // Create product with default basic variant so it works
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

  if (loading) return <div>Loading products...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Products</h2>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          {showAdd ? 'Cancel' : '+ Add Product'}
        </button>
      </div>
      
      {showAdd && (
        <form onSubmit={addProduct} className="bg-gray-50 p-6 rounded mb-8 border">
          <h3 className="font-bold mb-4">Add New Product</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input required placeholder="Product Name" value={newProduct.name} onChange={e=>setNewProduct({...newProduct, name: e.target.value})} className="border p-2 rounded" />
            <input required type="number" placeholder="Price" value={newProduct.price} onChange={e=>setNewProduct({...newProduct, price: e.target.value})} className="border p-2 rounded" />
            <select value={newProduct.gender} onChange={e=>setNewProduct({...newProduct, gender: e.target.value})} className="border p-2 rounded">
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
          <textarea required placeholder="Description" value={newProduct.description} onChange={e=>setNewProduct({...newProduct, description: e.target.value})} className="border p-2 rounded w-full mb-4" />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save Product</button>
        </form>
      )}

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
                <td className="p-4">\$\{p.price?.toFixed(2)}</td>
                <td className="p-4">{p.gender}</td>
                <td className="p-4">
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
